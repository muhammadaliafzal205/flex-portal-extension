# Quick Start Guide - Testing the Flex Portal Extension Locally

Welcome! This guide will help you set up and test the Flex Portal Extension on your local machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Loading the Extension](#loading-the-extension)
4. [Testing the Extension](#testing-the-extension)
5. [Troubleshooting](#troubleshooting)
6. [Common Issues](#common-issues)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **A Chromium-based browser** (Chrome, Edge, Brave, etc.)

To verify your installations, run:

```bash
node --version
npm --version
git --version
```

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/muhammadaliafzal205/flex-portal-extension.git
cd flex-portal-extension
```

### 2. Install Dependencies

```bash
npm install
# or if you prefer yarn
yarn install
```

### 3. Build the Extension

```bash
npm run build
# or
yarn build
```

This command compiles the extension files and prepares them for testing. The built files are typically output to a `dist/` or `build/` directory.

## Loading the Extension

### For Chrome/Edge/Brave Browsers:

1. **Open the Extension Management Page:**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`
   - Brave: Navigate to `brave://extensions/`

2. **Enable Developer Mode:**
   - Look for the toggle switch in the top-right corner labeled "Developer mode"
   - Click it to enable developer mode

3. **Load the Extension:**
   - Click the "Load unpacked" button that appears after enabling Developer mode
   - Navigate to your cloned repository directory
   - Select the `dist/` or `build/` folder (whichever your build process outputs to)
   - Click "Select Folder"

4. **Verify the Extension is Loaded:**
   - You should see your extension listed on the Extensions page
   - Note the Extension ID (you may need this for testing)
   - Ensure the extension is enabled (toggle switch should be on)

## Testing the Extension

### Basic Functionality Tests

#### 1. **Verify Extension Icon**
- Look for the extension icon in your browser's toolbar (top-right corner)
- Click it to open the extension popup (if applicable)
- Test that UI elements render correctly

#### 2. **Test Content Scripts**
- Navigate to the website(s) where the extension should run
- Open the browser's Developer Tools (F12 or Ctrl+Shift+I)
- Check the Console tab for any errors
- Verify that extension functionality works as expected

#### 3. **Test Background Scripts**
- In the Extensions page (`chrome://extensions/`), find your extension
- Click "background page" or "service worker" link (if available)
- This opens the background script's developer tools
- Check for errors and verify background functionality

#### 4. **Test Permissions**
- Verify that the extension has access to required permissions
- Check the "Permissions" section on the extension details page
- Ensure no unexpected permissions are requested

### Advanced Testing

#### Debugging with DevTools

To debug your extension:

1. **Background Script Debugging:**
   - Click "service worker" or "background page" on the extension details page
   - Set breakpoints and step through code

2. **Content Script Debugging:**
   - Open DevTools on the webpage where the content script runs
   - Content scripts appear under the "Sources" tab

3. **Popup/UI Debugging:**
   - Right-click the extension icon and select "Inspect popup"
   - This opens DevTools for the popup UI

#### Testing with Different Scenarios

- Test with JavaScript disabled/enabled
- Test on different websites
- Test with various screen sizes (responsive design)
- Clear extension data between tests:
  - Right-click the extension icon → "Options" (if available)
  - Or clear through browser settings

## Reloading During Development

After making changes to your code:

1. **Rebuild the extension:**
   ```bash
   npm run build
   ```

2. **Reload the extension:**
   - Go to `chrome://extensions/`
   - Find your extension and click the reload icon (circular arrow)

3. **Clear cache if needed:**
   - Sometimes you may need to clear the site's cache
   - In DevTools, Right-click → "Empty cache and hard reload"

## Troubleshooting

### Extension Not Appearing

- **Ensure the build was successful:** Check that the `dist/` or `build/` folder contains compiled files
- **Verify the manifest file:** Ensure `manifest.json` is present in the build directory
- **Try reloading:** Click the refresh icon on the extension details page

### Extension Loads But Doesn't Work

1. **Check the Console for errors:**
   - Open DevTools (F12)
   - Look for red error messages
   - Note the error messages for debugging

2. **Verify permissions in manifest.json:**
   - Ensure all necessary permissions are declared
   - Common permissions: `activeTab`, `scripting`, `storage`, `webRequest`, etc.

3. **Check content script injection:**
   - Navigate to the target website
   - Open DevTools
   - Go to Sources tab
   - Look for your content script under the extension folder

### Changes Not Reflecting

1. **Rebuild the extension:**
   ```bash
   npm run build
   ```

2. **Reload the extension:**
   - Click the reload icon on `chrome://extensions/`

3. **Hard refresh the target page:**
   - In DevTools, right-click the refresh button and select "Empty cache and hard reload"

## Common Issues

### Issue: "This extension is not listed on the Chrome Web Store"

**Solution:** This is expected for unpacked extensions during development. It's just a warning and doesn't affect functionality.

### Issue: "Extension disabled by Chrome"

**Solution:** 
- Re-enable the extension on the Extensions page
- Check if there are manifest errors in the DevTools console
- Verify your manifest.json syntax is valid (use a JSON validator)

### Issue: Permission Errors

**Solution:**
- Add required permissions to `manifest.json`
- Reload the extension
- Grant permissions when prompted

### Issue: Content Script Not Running

**Solution:**
- Check the `matches` pattern in manifest.json
- Ensure the pattern matches your test URL
- Verify the script file path is correct
- Check the DevTools console for load errors

### Issue: Port Already in Use (if using local server)

**Solution:**
```bash
# Find and kill the process using the port (example: port 3000)
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

## Useful Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [MDN WebExtensions Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Manifest v3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the repository's Issues page
2. Review the extension's README.md
3. Check browser console and background script logs for detailed error messages
4. Create a new issue with:
   - Browser version
   - Operating system
   - Steps to reproduce the issue
   - Error messages (from console/DevTools)
   - Expected vs. actual behavior

---

**Happy Testing!** 🚀

Last Updated: January 9, 2026
