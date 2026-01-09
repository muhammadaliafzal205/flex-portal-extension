/**
 * Popup Script - Handles popup UI interactions
 * Version: 1.0.0
 */

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', initializePopup);

/**
 * Initialize popup functionality
 */
function initializePopup() {
  console.log('[Popup] Initialized');
  
  // Attach tab switching functionality
  attachTabSwitching();
  
  // Attach button handlers
  attachButtonHandlers();
  
  // Load and display current settings
  loadPopupData();
  
  // Update time display
  updateTimeDisplay();
  setInterval(updateTimeDisplay, 60000);
}

/**
 * Attach tab switching functionality
 */
function attachTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const tabName = button.getAttribute('data-tab');
      if (!tabName) return;
      
      // Remove active class from all buttons and contents
      document.querySelectorAll('.tab-button').forEach((btn) => {
        btn.classList.remove('active');
      });
      document.querySelectorAll('.tab-content').forEach((content) => {
        content.classList.remove('active');
      });
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const tabContent = document.getElementById(tabName);
      if (tabContent) {
        tabContent.classList.add('active');
      }
      
      console.log('[Popup] Switched to tab:', tabName);
    });
  });
}

/**
 * Attach event handlers to buttons
 */
function attachButtonHandlers() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      handleButtonClick(button);
    });
  });
}

/**
 * Handle button click events
 * @param {HTMLElement} button - Clicked button element
 */
function handleButtonClick(button) {
  const buttonText = button.textContent.trim();
  const action = button.getAttribute('data-action');
  
  console.log('[Button Clicked]', buttonText);
  
  switch (buttonText) {
    case 'Update Now':
      showNotification('Update started...', 'info', 2000);
      break;
    
    case 'Later':
      showNotification('Update reminder set', 'info', 2000);
      break;
    
    case 'Clear Cache':
      chrome.storage.local.clear(() => {
        showNotification('Cache cleared successfully', 'success', 2000);
      });
      break;
    
    case 'Skip':
      showNotification('Skipped', 'info', 2000);
      break;
    
    case 'Clear Data':
      if (confirm('Are you sure you want to clear all data?')) {
        chrome.storage.local.clear(() => {
          showNotification('All data cleared', 'success', 2000);
        });
      }
      break;
    
    case 'Reset Settings':
      if (confirm('Are you sure you want to reset all settings?')) {
        chrome.storage.local.set({
          extensionEnabled: true,
          autoRefresh: false,
          refreshInterval: 5000,
          notifications: true,
          theme: 'light'
        }, () => {
          showNotification('Settings reset to default', 'success', 2000);
        });
      }
      break;
    
    case 'View Logs':
      showNotification('Opening logs...', 'info', 2000);
      break;
    
    default:
      if (action) {
        handleCustomAction(action);
      }
  }
}

/**
 * Handle custom actions
 * @param {string} action - Action name
 */
function handleCustomAction(action) {
  switch (action) {
    case 'open-settings':
      chrome.runtime.openOptionsPage();
      break;
    
    case 'open-help':
      chrome.tabs.create({ url: 'https://github.com/muhammadaliafzal205/flex-portal-extension' });
      break;
    
    default:
      console.log('[Custom Action]', action);
  }
}

/**
 * Load popup data from storage
 */
function loadPopupData() {
  chrome.storage.local.get(null, (result) => {
    if (chrome.runtime.lastError) {
      console.error('[Popup] Error loading data:', chrome.runtime.lastError);
      return;
    }
    
    console.log('[Popup] Loaded data:', result);
    
    // Update popup display with loaded data if needed
    if (result && Object.keys(result).length > 0) {
      // Data is available
      console.log('[Popup] Data loaded successfully');
    }
  });
}

/**
 * Update time display
 */
function updateTimeDisplay() {
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    const now = new Date();
    const iso = now.toISOString();
    const date = iso.split('T')[0];
    const time = iso.split('T')[1].substring(0, 8);
    timeElement.textContent = `Last updated: ${date} ${time} UTC`;
  }
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 16px 20px;
    border-radius: 6px;
    border-left: 4px solid;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  // Set border color based on type
  const borderColors = {
    success: '#48bb78',
    error: '#f56565',
    warning: '#ed8936',
    info: '#4299e1'
  };
  notification.style.borderLeftColor = borderColors[type] || borderColors.info;
  
  // Add message
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, duration);
  }
}

/**
 * Send message to background script
 * @param {object} message - Message to send
 * @param {function} callback - Response callback
 */
function sendMessageToBackground(message, callback) {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Popup] Error sending message:', chrome.runtime.lastError);
        if (callback) callback({ error: chrome.runtime.lastError.message });
      } else {
        if (callback) callback(response);
      }
    });
  } else {
    console.error('[Popup] Chrome runtime not available');
  }
}

/**
 * Get current popup status
 */
function getPopupStatus() {
  sendMessageToBackground(
    { action: 'getPopupStatus' },
    (response) => {
      if (response && response.success) {
        console.log('[Popup] Status:', response);
      }
    }
  );
}

// Listen for messages from background script
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Popup] Message received:', request);
    
    if (request.action === 'updatePopup') {
      loadPopupData();
      sendResponse({ received: true });
    }
  });
}

// Clean up when popup closes
window.addEventListener('beforeunload', () => {
  console.log('[Popup] Closing');
});

console.log('[Popup] Script loaded successfully');