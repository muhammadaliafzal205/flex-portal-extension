/**
 * Flex Portal Extension - Content Script
 * Monitors changes on the Flex Portal website
 * Created: 2026-01-09 19:23:02 UTC
 */

// Configuration
const CONFIG = {
  MONITOR_INTERVAL: 1000, // Check for changes every 1 second
  DEBOUNCE_DELAY: 500, // Debounce change notifications
  MUTATION_CONFIG: {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'data-*', 'style'],
    characterData: false
  }
};

// State tracking
let lastNotificationTime = 0;
let observerInstance = null;
let monitoringActive = true;

/**
 * Initialize the content script
 */
function init() {
  console.log('[Flex Portal Extension] Content script initialized');
  setupMutationObserver();
  setupMessageListener();
  notifyExtensionReady();
}

/**
 * Setup MutationObserver to detect DOM changes
 */
function setupMutationObserver() {
  const callback = (mutations) => {
    handleDOMChanges(mutations);
  };

  observerInstance = new MutationObserver(callback);
  
  // Start observing the document
  observerInstance.observe(document.documentElement, CONFIG.MUTATION_CONFIG);
  console.log('[Flex Portal Extension] MutationObserver started');
}

/**
 * Handle detected DOM changes
 * @param {MutationRecord[]} mutations - Array of mutation records
 */
function handleDOMChanges(mutations) {
  if (!monitoringActive) return;

  const changeDetails = {
    timestamp: new Date().toISOString(),
    mutationCount: mutations.length,
    changes: []
  };

  mutations.forEach((mutation) => {
    if (shouldIgnoreMutation(mutation)) return;

    const changeInfo = {
      type: mutation.type,
      target: getElementInfo(mutation.target),
      details: {}
    };

    if (mutation.type === 'childList') {
      changeInfo.details = {
        addedNodes: mutation.addedNodes.length,
        removedNodes: mutation.removedNodes.length
      };
    } else if (mutation.type === 'attributes') {
      changeInfo.details = {
        attribute: mutation.attributeName,
        oldValue: mutation.oldValue,
        newValue: mutation.target.getAttribute(mutation.attributeName)
      };
    } else if (mutation.type === 'characterData') {
      changeInfo.details = {
        oldValue: mutation.oldValue,
        newValue: mutation.target.textContent
      };
    }

    changeDetails.changes.push(changeInfo);
  });

  // Debounce notifications
  if (changeDetails.changes.length > 0) {
    debouncedNotifyChanges(changeDetails);
  }
}

/**
 * Debounced change notification
 * @param {Object} changeDetails - Details of changes detected
 */
function debouncedNotifyChanges(changeDetails) {
  const now = Date.now();
  
  if (now - lastNotificationTime >= CONFIG.DEBOUNCE_DELAY) {
    lastNotificationTime = now;
    notifyChangesDetected(changeDetails);
  }
}

/**
 * Send change notification to background script
 * @param {Object} changeDetails - Details of changes detected
 */
function notifyChangesDetected(changeDetails) {
  chrome.runtime.sendMessage({
    action: 'changeDetected',
    data: changeDetails
  }).catch((error) => {
    console.warn('[Flex Portal Extension] Failed to send message:', error);
  });
}

/**
 * Notify that content script is ready
 */
function notifyExtensionReady() {
  chrome.runtime.sendMessage({
    action: 'contentScriptReady',
    timestamp: new Date().toISOString()
  }).catch((error) => {
    console.warn('[Flex Portal Extension] Failed to notify ready:', error);
  });
}

/**
 * Setup message listener for commands from background script
 */
function setupMessageListener() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Flex Portal Extension] Message received:', request.action);

    switch (request.action) {
      case 'toggleMonitoring':
        monitoringActive = request.enabled;
        sendResponse({ 
          success: true, 
          message: `Monitoring ${monitoringActive ? 'enabled' : 'disabled'}` 
        });
        break;

      case 'getPageInfo':
        sendResponse(getPageInfo());
        break;

      case 'getMonitoringStatus':
        sendResponse({
          active: monitoringActive,
          timestamp: new Date().toISOString()
        });
        break;

      case 'captureSnapshot':
        sendResponse(capturePageSnapshot());
        break;

      default:
        sendResponse({ error: 'Unknown action' });
    }
  });
}

/**
 * Get current page information
 * @returns {Object} Page information
 */
function getPageInfo() {
  return {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    domSize: document.documentElement.outerHTML.length,
    elementCount: document.querySelectorAll('*').length
  };
}

/**
 * Capture a snapshot of the current page state
 * @returns {Object} Page snapshot data
 */
function capturePageSnapshot() {
  return {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    title: document.title,
    bodyContent: document.body.innerHTML.substring(0, 10000), // Limit size
    formData: captureFormData(),
    pageMetadata: getPageMetadata()
  };
}

/**
 * Capture form data from the page
 * @returns {Object} Form data
 */
function captureFormData() {
  const formData = {};
  
  document.querySelectorAll('input, textarea, select').forEach((element) => {
    if (element.name && !element.type?.includes('password')) {
      formData[element.name] = element.value;
    }
  });

  return formData;
}

/**
 * Get page metadata
 * @returns {Object} Metadata information
 */
function getPageMetadata() {
  const metadata = {};
  
  document.querySelectorAll('meta').forEach((meta) => {
    const name = meta.name || meta.getAttribute('property');
    const content = meta.content;
    if (name && content) {
      metadata[name] = content;
    }
  });

  return metadata;
}

/**
 * Get information about an element
 * @param {Element} element - DOM element
 * @returns {Object} Element information
 */
function getElementInfo(element) {
  return {
    tag: element.tagName?.toLowerCase(),
    id: element.id || null,
    className: element.className || null,
    text: element.textContent?.substring(0, 100) || null
  };
}

/**
 * Check if mutation should be ignored
 * @param {MutationRecord} mutation - Mutation record
 * @returns {boolean} Whether to ignore this mutation
 */
function shouldIgnoreMutation(mutation) {
  // Ignore script and style tags
  if (mutation.target.tagName?.toLowerCase?.() === 'script' || 
      mutation.target.tagName?.toLowerCase?.() === 'style') {
    return true;
  }

  // Ignore certain attributes
  const ignoredAttributes = ['data-mutation-id', 'data-observed'];
  if (mutation.type === 'attributes' && 
      ignoredAttributes.includes(mutation.attributeName)) {
    return true;
  }

  return false;
}

/**
 * Stop monitoring and cleanup
 */
function stop() {
  if (observerInstance) {
    observerInstance.disconnect();
    observerInstance = null;
  }
  monitoringActive = false;
  console.log('[Flex Portal Extension] Content script stopped');
}

// Cleanup on page unload
window.addEventListener('beforeunload', stop);

// Initialize when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    stop,
    getPageInfo,
    capturePageSnapshot,
    setupMutationObserver
  };
}
