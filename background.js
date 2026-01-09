// Background script for Flex Portal Extension
// This script handles:
// - Service worker lifecycle
// - Extension message passing
// - Offscreen document management

let offscreenCreated = false;

// Initialize offscreen document on install/startup
chrome.runtime.onStartup.addListener(() => {
  ensureOffscreenDocument();
});

chrome.runtime.onInstalled.addListener(() => {
  ensureOffscreenDocument();
});

// Handle messages from content scripts and other extension components
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendEmail') {
    handleSendEmail(request, sendResponse);
    return true; // Keep channel open for async response
  }
  if (request.action === 'getOffscreenStatus') {
    sendResponse({ offscreenReady: offscreenCreated });
  }
});

// Function to ensure offscreen document exists
async function ensureOffscreenDocument() {
  if (offscreenCreated) return;

  try {
    // Check if offscreen document already exists
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });

    if (existingContexts.length > 0) {
      offscreenCreated = true;
      return;
    }

    // Create offscreen document if it doesn't exist
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['DOM_MANIPULATION'],
      justification: 'Needed to interact with DOM for email sending functionality'
    });

    offscreenCreated = true;
  } catch (error) {
    console.error('Error ensuring offscreen document:', error);
    // Silently fail - offscreen document may already exist
  }
}

// Handle sending email through offscreen document
async function handleSendEmail(request, sendResponse) {
  try {
    // Ensure offscreen document is ready
    await ensureOffscreenDocument();

    // Send message to offscreen document
    const response = await chrome.runtime.sendMessage({
      action: 'sendEmail',
      to: request.to,
      cc: request.cc,
      subject: request.subject,
      body: request.body
    }, { targetId: (await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] }))[0]?.contextId });

    sendResponse({ success: true, message: response });
  } catch (error) {
    console.error('Error sending email:', error);
    sendResponse({ success: false, error: error.message });
  }
}
