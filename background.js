// Flex Portal Extension - Background Script
// Handles extension lifecycle, message passing, and data persistence

// Initialize extension on install/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default configuration on first install
    chrome.storage.local.set({
      extensionEnabled: true,
      autoRefresh: false,
      refreshInterval: 5000,
      notifications: true,
      theme: 'light'
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    });
  } else if (details.reason === 'update') {
    // Handle updates if needed
    console.log('Extension updated to version', chrome.runtime.getManifest().version);
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, data } = request;

  switch (action) {
    case 'fetchPortalData':
      handleFetchPortalData(data, sendResponse);
      break;
    
    case 'saveUserSettings':
      handleSaveUserSettings(data, sendResponse);
      break;
    
    case 'getUserSettings':
      handleGetUserSettings(sendResponse);
      break;
    
    case 'logoutUser':
      handleLogoutUser(sendResponse);
      break;
    
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }

  // Return true to indicate we'll send response asynchronously
  return true;
});

// Handle fetching portal data
function handleFetchPortalData(data, callback) {
  const { url, method = 'GET' } = data;

  if (!url) {
    callback({ success: false, error: 'URL is required' });
    return;
  }

  // Retrieve auth token from storage
  chrome.storage.local.get(['authToken'], (result) => {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (result.authToken) {
      headers['Authorization'] = `Bearer ${result.authToken}`;
    }

    fetch(url, {
      method: method,
      headers: headers,
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        callback({
          success: true,
          data: data
        });
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        callback({
          success: false,
          error: error.message
        });
      });
  });
}

// Handle saving user settings
function handleSaveUserSettings(data, callback) {
  if (!data || Object.keys(data).length === 0) {
    callback({ success: false, error: 'No settings provided' });
    return;
  }

  chrome.storage.local.set(data, () => {
    if (chrome.runtime.lastError) {
      callback({
        success: false,
        error: chrome.runtime.lastError.message
      });
    } else {
      callback({ success: true, message: 'Settings saved successfully' });
    }
  });
}

// Handle retrieving user settings
function handleGetUserSettings(callback) {
  chrome.storage.local.get(null, (result) => {
    if (chrome.runtime.lastError) {
      callback({
        success: false,
        error: chrome.runtime.lastError.message
      });
    } else {
      callback({
        success: true,
        data: result
      });
    }
  });
}

// Handle user logout
function handleLogoutUser(callback) {
  const keysToRemove = ['authToken', 'userData', 'sessionToken'];

  chrome.storage.local.remove(keysToRemove, () => {
    if (chrome.runtime.lastError) {
      callback({
        success: false,
        error: chrome.runtime.lastError.message
      });
    } else {
      // Notify all tabs to update UI
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'userLoggedOut'
          }).catch(() => {
            // Silently ignore errors from tabs that don't have content script
          });
        });
      });

      callback({ success: true, message: 'User logged out successfully' });
    }
  });
}

// Listen for tab updates to monitor user activity
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Check if page requires authentication
    checkAuthenticationStatus(tab.url);
  }
});

// Helper function to check authentication status
function checkAuthenticationStatus(url) {
  if (!url) return;

  chrome.storage.local.get(['authToken'], (result) => {
    if (!result.authToken && isFlexPortalUrl(url)) {
      // User is not authenticated but visiting flex portal
      console.warn('User visiting Flex Portal without authentication');
    }
  });
}

// Helper function to check if URL is a Flex Portal URL
function isFlexPortalUrl(url) {
  if (!url) return false;
  const portalDomains = ['flexportal.com', 'app.flexportal.com', 'localhost:3000'];
  return portalDomains.some((domain) => url.includes(domain));
}

// Periodic check for session validity
setInterval(() => {
  chrome.storage.local.get(['sessionToken', 'sessionExpiry'], (result) => {
    if (result.sessionToken && result.sessionExpiry) {
      const now = Date.now();
      if (now > result.sessionExpiry) {
        // Session expired, logout user
        chrome.storage.local.remove(['sessionToken', 'sessionExpiry', 'authToken']);
        console.log('Session expired, user logged out');
      }
    }
  });
}, 60000); // Check every minute

// Listen for alarm events (for scheduled tasks)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'autoRefresh') {
    chrome.storage.local.get(['autoRefresh'], (result) => {
      if (result.autoRefresh) {
        // Trigger auto-refresh logic
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              action: 'refreshData'
            }).catch(() => {
              // Silently ignore errors
            });
          });
        });
      }
    });
  }
});

// Clean up on extension unload
chrome.runtime.onSuspend.addListener(() => {
  console.log('Extension is being suspended');
  // Perform cleanup if needed
});

console.log('Flex Portal Extension background script loaded');