/**
 * Popup.js - Handles popup interactions and notifications
 * Version: 1.0.0
 * Date: 2026-01-09
 */

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Show notification with specified type and message
 * @param {string} message - The notification message
 * @param {string} type - Type of notification: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
  const notificationContainer = getOrCreateNotificationContainer();
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  
  notification.innerHTML = `
    <span class="notification-icon">${getNotificationIcon(type)}</span>
    <span class="notification-message">${escapeHtml(message)}</span>
    <button class="notification-close" aria-label="Close notification">&times;</button>
  `;
  
  notificationContainer.appendChild(notification);
  
  // Add animation class
  requestAnimationFrame(() => notification.classList.add('notification-show'));
  
  // Close button handler
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => removeNotification(notification));
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => removeNotification(notification), duration);
  }
  
  return notification;
}

/**
 * Get or create notification container
 * @returns {HTMLElement} Notification container element
 */
function getOrCreateNotificationContainer() {
  let container = document.getElementById('notification-container');
  
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  return container;
}

/**
 * Remove notification with animation
 * @param {HTMLElement} notification - Notification element to remove
 */
function removeNotification(notification) {
  notification.classList.remove('notification-show');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Icon HTML
 */
function getNotificationIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// ============================================================================
// Popup Interaction Handlers
// ============================================================================

/**
 * Initialize popup event listeners
 */
function initializePopup() {
  // Button click handlers
  attachButtonListeners();
  
  // Input handlers
  attachInputListeners();
  
  // Close button handler
  attachCloseHandler();
  
  // Load saved data
  loadPopupState();
  
  // Log initialization
  console.log('[Popup] Initialized at', new Date().toISOString());
}

/**
 * Attach event listeners to buttons
 */
function attachButtonListeners() {
  const buttons = document.querySelectorAll('[data-action]');
  
  buttons.forEach((button) => {
    button.addEventListener('click', handleButtonClick);
  });
}

/**
 * Handle button click events
 * @param {Event} event - Click event
 */
function handleButtonClick(event) {
  const action = event.currentTarget.getAttribute('data-action');
  const actionData = event.currentTarget.getAttribute('data-value');
  
  console.log('[Button Click] Action:', action, 'Data:', actionData);
  
  switch (action) {
    case 'submit':
      handleSubmit();
      break;
    case 'reset':
      handleReset();
      break;
    case 'clear':
      handleClear();
      break;
    case 'copy':
      handleCopy(actionData);
      break;
    case 'open-link':
      handleOpenLink(actionData);
      break;
    default:
      console.warn('[Button Click] Unknown action:', action);
  }
}

/**
 * Attach event listeners to input fields
 */
function attachInputListeners() {
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach((input) => {
    input.addEventListener('change', handleInputChange);
    input.addEventListener('input', handleInputChange);
  });
}

/**
 * Handle input change events
 * @param {Event} event - Change event
 */
function handleInputChange(event) {
  const { name, value, type } = event.target;
  
  // Validate input
  if (type === 'email' && !isValidEmail(value)) {
    showNotification('Please enter a valid email address', 'warning', 2000);
    event.target.classList.add('input-error');
    return;
  }
  
  event.target.classList.remove('input-error');
  
  // Save to local storage
  saveInputState(name, value);
  
  console.log('[Input Change]', name, ':', value);
}

/**
 * Attach close button handler
 */
function attachCloseHandler() {
  const closeBtn = document.querySelector('[data-close]');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }
}

/**
 * Close the popup
 */
function closePopup() {
  console.log('[Popup] Closing');
  window.close();
}

// ============================================================================
// Form Action Handlers
// ============================================================================

/**
 * Handle form submission
 */
function handleSubmit() {
  const form = document.querySelector('form') || document.querySelector('[role="form"]');
  
  if (!form) {
    showNotification('No form found', 'error');
    return;
  }
  
  // Validate form
  if (!validateForm(form)) {
    showNotification('Please fill in all required fields', 'warning');
    return;
  }
  
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Log submission
  console.log('[Form Submit]', data);
  
  // Send to background script or content script
  sendMessage({
    action: 'formSubmit',
    data: data
  });
  
  showNotification('Form submitted successfully!', 'success');
}

/**
 * Handle form reset
 */
function handleReset() {
  const form = document.querySelector('form') || document.querySelector('[role="form"]');
  
  if (form) {
    form.reset();
    clearInputState();
    showNotification('Form reset', 'info');
    console.log('[Form Reset]');
  }
}

/**
 * Handle clear action
 */
function handleClear() {
  clearInputState();
  showNotification('Data cleared', 'info');
  console.log('[Clear Data]');
}

/**
 * Handle copy to clipboard
 * @param {string} text - Text to copy
 */
function handleCopy(text) {
  if (!text) {
    showNotification('Nothing to copy', 'warning');
    return;
  }
  
  navigator.clipboard.writeText(text)
    .then(() => {
      showNotification('Copied to clipboard!', 'success', 2000);
      console.log('[Copy] Text copied:', text);
    })
    .catch((error) => {
      showNotification('Failed to copy text', 'error');
      console.error('[Copy] Error:', error);
    });
}

/**
 * Handle open link
 * @param {string} url - URL to open
 */
function handleOpenLink(url) {
  if (!url) {
    showNotification('No URL provided', 'warning');
    return;
  }
  
  chrome.tabs.create({ url: url });
  console.log('[Open Link]', url);
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate form
 * @param {HTMLElement} form - Form element to validate
 * @returns {boolean} True if valid
 */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  
  for (let field of requiredFields) {
    if (!field.value.trim()) {
      field.classList.add('input-error');
      return false;
    }
    field.classList.remove('input-error');
  }
  
  return true;
}

// ============================================================================
// Storage Management
// ============================================================================

/**
 * Save input state to local storage
 * @param {string} name - Input name
 * @param {string} value - Input value
 */
function saveInputState(name, value) {
  try {
    const state = JSON.parse(localStorage.getItem('popupState')) || {};
    state[name] = value;
    localStorage.setItem('popupState', JSON.stringify(state));
  } catch (error) {
    console.error('[Storage] Error saving state:', error);
  }
}

/**
 * Load popup state from local storage
 */
function loadPopupState() {
  try {
    const state = JSON.parse(localStorage.getItem('popupState')) || {};
    
    Object.entries(state).forEach(([name, value]) => {
      const input = document.querySelector(`[name="${name}"]`);
      if (input) {
        input.value = value;
      }
    });
    
    console.log('[Storage] State loaded');
  } catch (error) {
    console.error('[Storage] Error loading state:', error);
  }
}

/**
 * Clear input state from storage
 */
function clearInputState() {
  try {
    localStorage.removeItem('popupState');
    document.querySelectorAll('input, textarea').forEach((input) => {
      input.value = '';
    });
    console.log('[Storage] State cleared');
  } catch (error) {
    console.error('[Storage] Error clearing state:', error);
  }
}

// ============================================================================
// Message Handling
// ============================================================================

/**
 * Send message to background script
 * @param {object} message - Message object
 */
function sendMessage(message) {
  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[Message] Error:', chrome.runtime.lastError);
      showNotification('Communication error', 'error');
      return;
    }
    
    console.log('[Message] Response:', response);
    
    if (response && response.success) {
      showNotification(response.message || 'Operation completed', 'success');
    } else if (response && response.error) {
      showNotification(response.error, 'error');
    }
  });
}

/**
 * Listen for messages from background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Message Received]', request);
  
  if (request.action === 'showNotification') {
    showNotification(request.message, request.type, request.duration);
  }
  
  sendResponse({ received: true });
});

// ============================================================================
// Initialization
// ============================================================================

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePopup);
} else {
  initializePopup();
}

// Log when popup is closed
window.addEventListener('beforeunload', () => {
  console.log('[Popup] Closing');
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showNotification,
    closePopup,
    handleSubmit,
    handleReset,
    handleClear,
    handleCopy,
    handleOpenLink,
    isValidEmail,
    validateForm,
    saveInputState,
    loadPopupState,
    clearInputState,
    sendMessage
  };
}
