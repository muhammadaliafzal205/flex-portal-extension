/**
 * Background Service Worker for Flex Portal Extension
 * Handles notifications, background tasks, and event listeners
 * Last Updated: 2026-01-09
 */

// =============================================================================
// INITIALIZATION
// =============================================================================

// Set up service worker lifecycle events
console.log('[Service Worker] Background script loaded');

// Store for managing active notifications
const activeNotifications = new Map();

// =============================================================================
// NOTIFICATION HANDLING
// =============================================================================

/**
 * Create and display a notification
 * @param {string} id - Unique notification identifier
 * @param {Object} options - Notification options
 */
async function showNotification(id, options) {
  try {
    const defaultOptions = {
      icon: 'icons/icon-48x48.png',
      badge: 'icons/icon-badge-32x32.png',
      requireInteraction: false,
      ...options
    };

    await chrome.notifications.create(id, {
      type: 'basic',
      ...defaultOptions
    });

    activeNotifications.set(id, {
      createdAt: new Date(),
      options: defaultOptions
    });

    console.log(`[Notification] Created: ${id}`);
  } catch (error) {
    console.error(`[Notification Error] Failed to create notification ${id}:`, error);
  }
}

/**
 * Update an existing notification
 * @param {string} id - Notification identifier
 * @param {Object} options - Updated notification options
 */
async function updateNotification(id, options) {
  try {
    const currentNotification = activeNotifications.get(id);
    if (!currentNotification) {
      console.warn(`[Notification] Notification ${id} not found`);
      return;
    }

    const updatedOptions = {
      ...currentNotification.options,
      ...options
    };

    await chrome.notifications.update(id, updatedOptions);
    activeNotifications.set(id, {
      createdAt: currentNotification.createdAt,
      updatedAt: new Date(),
      options: updatedOptions
    });

    console.log(`[Notification] Updated: ${id}`);
  } catch (error) {
    console.error(`[Notification Error] Failed to update notification ${id}:`, error);
  }
}

/**
 * Clear a notification
 * @param {string} id - Notification identifier
 */
async function clearNotification(id) {
  try {
    await chrome.notifications.clear(id);
    activeNotifications.delete(id);
    console.log(`[Notification] Cleared: ${id}`);
  } catch (error) {
    console.error(`[Notification Error] Failed to clear notification ${id}:`, error);
  }
}

/**
 * Clear all active notifications
 */
async function clearAllNotifications() {
  try {
    for (const id of activeNotifications.keys()) {
      await chrome.notifications.clear(id);
    }
    activeNotifications.clear();
    console.log('[Notification] All notifications cleared');
  } catch (error) {
    console.error('[Notification Error] Failed to clear all notifications:', error);
  }
}

// =============================================================================
// EVENT LISTENERS - MESSAGE HANDLING
// =============================================================================

/**
 * Listen for messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Message Received]', request.action, request);

  try {
    switch (request.action) {
      case 'SHOW_NOTIFICATION':
        showNotification(request.id, request.options)
          .then(() => sendResponse({ success: true }))
          .catch(error => sendResponse({ success: false, error: error.message }));
        return true;

      case 'UPDATE_NOTIFICATION':
        updateNotification(request.id, request.options)
          .then(() => sendResponse({ success: true }))
          .catch(error => sendResponse({ success: false, error: error.message }));
        return true;

      case 'CLEAR_NOTIFICATION':
        clearNotification(request.id)
          .then(() => sendResponse({ success: true }))
          .catch(error => sendResponse({ success: false, error: error.message }));
        return true;

      case 'CLEAR_ALL_NOTIFICATIONS':
        clearAllNotifications()
          .then(() => sendResponse({ success: true }))
          .catch(error => sendResponse({ success: false, error: error.message }));
        return true;

      case 'GET_ACTIVE_NOTIFICATIONS':
        const notifications = Array.from(activeNotifications.entries()).map(([id, data]) => ({
          id,
          ...data
        }));
        sendResponse({ success: true, notifications });
        break;

      case 'SCHEDULE_TASK':
        scheduleBackgroundTask(request.task)
          .then(() => sendResponse({ success: true }))
          .catch(error => sendResponse({ success: false, error: error.message }));
        return true;

      case 'GET_EXTENSION_STATUS':
        sendResponse({ 
          success: true, 
          status: 'active',
          timestamp: new Date().toISOString(),
          version: chrome.runtime.getManifest().version
        });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('[Message Handler Error]', error);
    sendResponse({ success: false, error: error.message });
  }
});

// =============================================================================
// NOTIFICATION CLICK HANDLERS
// =============================================================================

/**
 * Handle notification clicks
 */
chrome.notifications.onClicked.addListener((notificationId) => {
  console.log(`[Notification Clicked] ${notificationId}`);

  const notification = activeNotifications.get(notificationId);
  if (notification && notification.options.clickAction) {
    handleNotificationAction(notificationId, 'click', notification.options);
  }

  clearNotification(notificationId);
});

/**
 * Handle notification button clicks
 */
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  console.log(`[Notification Button Clicked] ${notificationId}, button: ${buttonIndex}`);

  const notification = activeNotifications.get(notificationId);
  if (notification) {
    handleNotificationAction(notificationId, 'button', {
      ...notification.options,
      buttonIndex
    });
  }

  clearNotification(notificationId);
});

/**
 * Handle notification closure
 */
chrome.notifications.onClosed.addListener((notificationId, byUser) => {
  console.log(`[Notification Closed] ${notificationId}, by user: ${byUser}`);
  activeNotifications.delete(notificationId);
});

/**
 * Process notification action
 * @param {string} notificationId - Notification identifier
 * @param {string} action - Action type ('click' or 'button')
 * @param {Object} options - Notification options
 */
function handleNotificationAction(notificationId, action, options) {
  try {
    // Broadcast action to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'NOTIFICATION_ACTION',
          notificationId,
          actionType: action,
          options
        }).catch(() => {
          // Tab might not have content script loaded, ignore
        });
      });
    });
  } catch (error) {
    console.error('[Action Handler Error]', error);
  }
}

// =============================================================================
// BACKGROUND TASKS
// =============================================================================

// Storage for scheduled tasks
const scheduledTasks = new Map();

/**
 * Schedule a background task
 * @param {Object} task - Task configuration
 * @param {string} task.id - Task identifier
 * @param {string} task.action - Action to perform
 * @param {number} task.interval - Interval in milliseconds (0 for one-time)
 * @param {Object} task.data - Additional task data
 */
async function scheduleBackgroundTask(task) {
  const { id, action, interval = 0, data = {} } = task;

  console.log(`[Task Scheduled] ${id} - Action: ${action}, Interval: ${interval}ms`);

  try {
    if (scheduledTasks.has(id)) {
      clearInterval(scheduledTasks.get(id).intervalId);
      scheduledTasks.delete(id);
    }

    const executeTask = async () => {
      try {
        await performBackgroundTask(id, action, data);
      } catch (error) {
        console.error(`[Task Error] Error executing task ${id}:`, error);
      }
    };

    // Execute immediately
    await executeTask();

    // Schedule recurring task if interval is specified
    if (interval > 0) {
      const intervalId = setInterval(executeTask, interval);
      scheduledTasks.set(id, { action, interval, data, intervalId });
    }
  } catch (error) {
    console.error(`[Task Scheduling Error] ${id}:`, error);
    throw error;
  }
}

/**
 * Execute a background task
 * @param {string} id - Task identifier
 * @param {string} action - Action to perform
 * @param {Object} data - Task data
 */
async function performBackgroundTask(id, action, data) {
  console.log(`[Task Executing] ${id} - ${action}`);

  try {
    switch (action) {
      case 'SYNC_DATA':
        await syncData(data);
        break;

      case 'CHECK_STATUS':
        await checkPortalStatus(data);
        break;

      case 'CLEANUP_CACHE':
        await cleanupCache(data);
        break;

      case 'REFRESH_TOKEN':
        await refreshAuthToken(data);
        break;

      default:
        console.warn(`[Task] Unknown action: ${action}`);
    }
  } catch (error) {
    console.error(`[Task Execution Error] ${id}:`, error);
    throw error;
  }
}

/**
 * Sync data with storage
 */
async function syncData(data) {
  return new Promise((resolve) => {
    chrome.storage.local.get('flexPortalData', (result) => {
      const currentData = result.flexPortalData || {};
      const updatedData = { ...currentData, ...data, lastSync: new Date().toISOString() };
      chrome.storage.local.set({ flexPortalData: updatedData }, resolve);
    });
  });
}

/**
 * Check portal status
 */
async function checkPortalStatus(data) {
  try {
    // Broadcast status check to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'CHECK_STATUS',
          data
        }).catch(() => {
          // Tab might not have content script loaded
        });
      });
    });
    console.log('[Background Task] Portal status checked');
  } catch (error) {
    console.error('[Status Check Error]', error);
  }
}

/**
 * Cleanup cache
 */
async function cleanupCache(data) {
  try {
    const maxAge = data.maxAge || 7 * 24 * 60 * 60 * 1000; // 7 days default
    
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (items) => {
        const now = Date.now();
        const keysToRemove = [];

        for (const [key, value] of Object.entries(items)) {
          if (value.timestamp && (now - value.timestamp) > maxAge) {
            keysToRemove.push(key);
          }
        }

        if (keysToRemove.length > 0) {
          chrome.storage.local.remove(keysToRemove, () => {
            console.log(`[Background Task] Cleaned up ${keysToRemove.length} items`);
            resolve();
          });
        } else {
          console.log('[Background Task] Cache cleanup: no items to remove');
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('[Cache Cleanup Error]', error);
  }
}

/**
 * Refresh authentication token
 */
async function refreshAuthToken(data) {
  try {
    return new Promise((resolve) => {
      chrome.storage.local.get('authToken', (result) => {
        if (result.authToken) {
          // Broadcast token refresh request
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              chrome.tabs.sendMessage(tab.id, {
                action: 'REFRESH_TOKEN'
              }).catch(() => {
                // Tab might not have content script loaded
              });
            });
          });
          console.log('[Background Task] Token refresh initiated');
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('[Token Refresh Error]', error);
  }
}

/**
 * Cancel a scheduled task
 * @param {string} id - Task identifier
 */
function cancelScheduledTask(id) {
  const task = scheduledTasks.get(id);
  if (task) {
    clearInterval(task.intervalId);
    scheduledTasks.delete(id);
    console.log(`[Task Cancelled] ${id}`);
    return true;
  }
  return false;
}

// =============================================================================
// CHROME EXTENSION LIFECYCLE EVENTS
// =============================================================================

/**
 * Extension installed
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Extension] Installed/Updated', details.reason);

  if (details.reason === 'install') {
    // Open welcome page
    chrome.tabs.create({ url: 'chrome://extensions/?options=' + chrome.runtime.id });
  }
});

/**
 * Extension startup
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('[Extension] Browser startup detected');
  
  // Initialize background tasks on startup
  initializeBackgroundTasks();
});

/**
 * Initialize background tasks
 */
function initializeBackgroundTasks() {
  try {
    chrome.storage.local.get('extensionSettings', (result) => {
      const settings = result.extensionSettings || {};
      
      // Set up periodic sync if enabled
      if (settings.enableAutoSync) {
        scheduleBackgroundTask({
          id: 'auto-sync',
          action: 'SYNC_DATA',
          interval: settings.syncInterval || 5 * 60 * 1000, // 5 minutes default
          data: {}
        });
      }

      // Set up periodic status check if enabled
      if (settings.enableStatusCheck) {
        scheduleBackgroundTask({
          id: 'status-check',
          action: 'CHECK_STATUS',
          interval: settings.statusCheckInterval || 10 * 60 * 1000, // 10 minutes default
          data: {}
        });
      }

      // Set up daily cleanup
      scheduleBackgroundTask({
        id: 'daily-cleanup',
        action: 'CLEANUP_CACHE',
        interval: 24 * 60 * 60 * 1000, // 24 hours
        data: { maxAge: 7 * 24 * 60 * 60 * 1000 }
      });

      console.log('[Background Tasks] Initialization completed');
    });
  } catch (error) {
    console.error('[Background Tasks Initialization Error]', error);
  }
}

// =============================================================================
// ALARM HANDLERS (for persistent background tasks)
// =============================================================================

/**
 * Handle chrome alarms
 */
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('[Alarm Triggered]', alarm.name);

  try {
    switch (alarm.name) {
      case 'PERIODIC_SYNC':
        performBackgroundTask('periodic-sync', 'SYNC_DATA', {});
        break;

      case 'PERIODIC_CHECK':
        performBackgroundTask('periodic-check', 'CHECK_STATUS', {});
        break;

      default:
        console.warn(`[Alarm] Unknown alarm: ${alarm.name}`);
    }
  } catch (error) {
    console.error('[Alarm Handler Error]', error);
  }
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get service worker status
 */
function getServiceWorkerStatus() {
  return {
    status: 'active',
    timestamp: new Date().toISOString(),
    activeNotifications: activeNotifications.size,
    scheduledTasks: scheduledTasks.size,
    version: chrome.runtime.getManifest().version
  };
}

/**
 * Log message with timestamp
 */
function logMessage(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}`;
  
  if (data) {
    console.log(logEntry, data);
  } else {
    console.log(logEntry);
  }
}

// =============================================================================
// INITIALIZATION ON LOAD
// =============================================================================

// Initialize on service worker startup
initializeBackgroundTasks();
console.log('[Service Worker] Initialization completed at', new Date().toISOString());
