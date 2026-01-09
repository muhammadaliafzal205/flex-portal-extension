# Flex Portal Extension

> A powerful and flexible browser extension that enhances your portal experience with advanced features, seamless integration, and user-friendly interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Repository](https://img.shields.io/badge/GitHub-flex--portal--extension-blue)](https://github.com/muhammadaliafzal205/flex-portal-extension)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [File Structure](#file-structure)
- [Testing Instructions](#testing-instructions)
- [Development Workflow](#development-workflow)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Privacy Statement](#privacy-statement)
- [License](#license)
- [Contributing Guidelines](#contributing-guidelines)
- [Roadmap](#roadmap)

---

## Features

- **Portal Enhancement**: Seamlessly integrates with portal interfaces to provide enhanced functionality
- **User-Friendly Interface**: Intuitive design for easy navigation and usability
- **Performance Optimized**: Lightweight extension that doesn't slow down your browser
- **Data Privacy**: Respects user privacy with transparent data handling practices
- **Cross-Browser Support**: Compatible with Chrome, Firefox, Edge, and other Chromium-based browsers
- **Customizable Settings**: Tailor the extension to your preferences
- **Real-time Updates**: Stay synchronized with the latest portal changes
- **Error Handling**: Robust error management and recovery mechanisms
- **Developer Friendly**: Well-documented codebase for easy maintenance and extension

---

## Installation

### From Source (Development)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/muhammadaliafzal205/flex-portal-extension.git
   cd flex-portal-extension
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome/Chromium Browser**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `build/` or `dist/` directory from this project

5. **Load in Firefox**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the manifest.json file from the project root

### From Chrome Web Store (When Available)

1. Visit the [Chrome Web Store](https://chromewebstore.google.com/)
2. Search for "Flex Portal Extension"
3. Click "Add to Chrome"
4. Confirm the permissions in the popup

---

## File Structure

```
flex-portal-extension/
├── src/
│   ├── manifest.json          # Extension configuration and metadata
│   ├── background.js          # Service worker for background tasks
│   ├── content.js             # Content script for DOM manipulation
│   ├── popup.html             # Popup UI HTML
│   ├── popup.js               # Popup UI logic
│   ├── popup.css              # Popup UI styles
│   ├── options.html           # Settings/Options page
│   ├── options.js             # Options page logic
│   ├── options.css            # Options page styles
│   ├── utils/
│   │   ├── storage.js         # Storage utility functions
│   │   ├── logger.js          # Logging utility
│   │   └── constants.js       # Global constants
│   ├── icons/
│   │   ├── icon16.png         # 16x16 icon
│   │   ├── icon48.png         # 48x48 icon
│   │   ├── icon128.png        # 128x128 icon
│   │   └── icon256.png        # 256x256 icon
│   └── styles/
│       └── shared.css         # Shared styles across components
├── tests/
│   ├── unit/
│   │   ├── utils.test.js      # Unit tests for utilities
│   │   └── background.test.js # Unit tests for background script
│   ├── integration/
│   │   └── integration.test.js # Integration tests
│   └── fixtures/
│       └── mock-data.js       # Mock data for testing
├── .github/
│   ├── workflows/
│   │   ├── ci.yml             # CI/CD pipeline
│   │   └── tests.yml          # Test workflow
│   └── ISSUE_TEMPLATE/
│       └── bug_report.md      # Bug report template
├── docs/
│   ├── API.md                 # API documentation
│   ├── ARCHITECTURE.md        # Architecture overview
│   └── DEVELOPMENT.md         # Development guide
├── .gitignore                 # Git ignore file
├── package.json               # Node.js dependencies and scripts
├── webpack.config.js          # Webpack configuration (if applicable)
├── jest.config.js             # Jest testing configuration
├── README.md                  # This file
├── LICENSE                    # MIT License
└── CONTRIBUTING.md            # Contributing guidelines

```

---

## Testing Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Running Tests

1. **Install Test Dependencies**
   ```bash
   npm install
   ```

2. **Run All Tests**
   ```bash
   npm test
   ```

3. **Run Unit Tests Only**
   ```bash
   npm run test:unit
   ```

4. **Run Integration Tests**
   ```bash
   npm run test:integration
   ```

5. **Run Tests with Coverage**
   ```bash
   npm run test:coverage
   ```

6. **Watch Mode (Auto-run on file changes)**
   ```bash
   npm run test:watch
   ```

### Test Structure

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components
- **Fixtures**: Mock data and setup for consistent test environments

### Writing Tests

Tests should follow this naming convention: `<file-name>.test.js`

Example:
```javascript
describe('Utility Functions', () => {
  test('should format data correctly', () => {
    const input = 'test';
    const expected = 'TEST';
    expect(formatData(input)).toBe(expected);
  });
});
```

---

## Development Workflow

### Getting Started

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Modify files in the `src/` directory
   - Follow coding standards and conventions
   - Add tests for new functionality

3. **Build the Extension**
   ```bash
   npm run build
   ```

4. **Test Locally**
   - Load the extension in your browser (see Installation section)
   - Test all functionality thoroughly
   - Check for console errors (F12 → Console)

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

6. **Push to Remote**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the GitHub repository
   - Click "Compare & pull request"
   - Fill in the PR template
   - Request reviewers

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build process, dependencies, etc.

**Example:**
```
feat(popup): add dark mode toggle

Allow users to switch between light and dark themes in the popup interface.
Persists user preference in local storage.

Closes #42
```

### Code Standards

- **JavaScript**: Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **CSS**: Follow [Google CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)
- **Comments**: Write clear, meaningful comments for complex logic
- **Variables**: Use descriptive names (e.g., `userPreferences` instead of `up`)

### Debugging

1. **Background Script**
   - Open extension options or popup
   - Go to `chrome://extensions/`
   - Find this extension and click "Inspect views"

2. **Content Script**
   - Right-click on page → "Inspect"
   - Check Console and Sources tabs

3. **Storage**
   ```javascript
   // View all storage
   chrome.storage.local.get(null, (items) => {
     console.log('All storage:', items);
   });
   ```

---

## Troubleshooting Guide

### Common Issues

#### 1. Extension Not Loading

**Problem:** Extension doesn't appear in `chrome://extensions/`

**Solution:**
- Ensure Developer mode is enabled
- Check that manifest.json exists in the correct location
- Verify the manifest.json syntax is valid (use JSON validator)
- Reload the extension (if already loaded)

#### 2. Content Script Not Running

**Problem:** Changes don't appear on the web page

**Solution:**
- Check the manifest.json `content_scripts` configuration
- Verify the `matches` pattern includes your target URLs
- Reload the extension and refresh the page
- Check the Console for errors (Ctrl+Shift+J)

#### 3. Storage Not Working

**Problem:** Settings aren't being saved

**Solution:**
```javascript
// Test storage access
chrome.storage.local.set({ test: 'value' }, () => {
  console.log('Storage works');
});
```
- Ensure using correct storage API (`chrome.storage.local` or `chrome.storage.sync`)
- Check browser permissions in manifest.json
- Clear extension data and try again

#### 4. Popup Not Displaying

**Problem:** Popup is blank or not showing content

**Solution:**
- Check popup.html is valid HTML
- Verify popup.js loads correctly
- Check Console in popup inspection for errors
- Ensure CSS files are properly linked

#### 5. High Memory Usage

**Problem:** Extension consuming too much memory

**Solution:**
- Check for memory leaks in background script
- Remove unnecessary event listeners
- Optimize data structures
- Profile with Chrome DevTools (Extensions icon → Inspect)

### Debug Mode

Enable debug logging:
```javascript
// In any script
localStorage.setItem('DEBUG', 'true');
```

### Performance Tips

- Use `chrome.alarms` instead of `setInterval` for background tasks
- Lazy-load scripts when possible
- Minimize DOM manipulation
- Use event delegation for event listeners
- Cache frequently accessed data

---

## Privacy Statement

### Data Collection

This extension respects user privacy and collects minimal data:

- **Local Storage**: User preferences are stored locally on the device only
- **Sync Storage**: Optional settings may be synced with the user's Google account (if enabled)
- **No Remote Transmission**: This extension does not send user data to external servers

### Permissions

This extension requests the following permissions:

- `storage`: To save user settings locally
- `activeTab`: To access the current tab's content
- `scripting`: To inject content scripts on matching pages

### Data Retention

- User data is stored until the extension is uninstalled
- Users can clear their data anytime through the extension options
- No backups or copies are maintained remotely

### Third-Party Services

This extension does not integrate with third-party services that collect data.

### Changes to Privacy Policy

We reserve the right to update this privacy statement. Changes will be reflected in the extension version updates.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### MIT License Summary

You are free to:
- ✅ Use the software for any purpose
- ✅ Copy, modify, and distribute the software
- ✅ Include the software in proprietary applications

Under the condition that:
- ⚠️ Include a copy of the license and copyright notice
- ⚠️ State significant changes made to the software

**Liability:** The software is provided "as is" without warranty.

---

## Contributing Guidelines

We welcome contributions from the community! Please follow these guidelines:

### Before You Start

1. Check existing [Issues](https://github.com/muhammadaliafzal205/flex-portal-extension/issues) and [Pull Requests](https://github.com/muhammadaliafzal205/flex-portal-extension/pulls)
2. Read the [Development Workflow](#development-workflow) section
3. Ensure you have the latest code from main branch

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/flex-portal-extension.git
   cd flex-portal-extension
   git remote add upstream https://github.com/muhammadaliafzal205/flex-portal-extension.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Add tests for new features
   - Update documentation as needed
   - Follow commit message conventions

4. **Test Your Changes**
   ```bash
   npm test
   npm run build
   ```

5. **Keep Your Branch Updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Fill Out the PR Template**
   - Describe what changes you made
   - Reference related issues
   - Explain the reasoning behind changes

### Pull Request Guidelines

- **Title**: Use descriptive, conventional format (e.g., `feat: add dark mode support`)
- **Description**: Clearly explain your changes and why they're needed
- **Testing**: Describe how you tested the changes
- **Screenshots**: Include before/after screenshots for UI changes
- **No Merge Conflicts**: Ensure your branch is up to date
- **All Tests Passing**: Run `npm test` and ensure all tests pass

### Code Review Process

1. At least one maintainer will review your PR
2. Feedback will be provided if changes are needed
3. Once approved, your PR will be merged
4. You'll be credited in release notes

### Reporting Issues

Use the [issue tracker](https://github.com/muhammadaliafzal205/flex-portal-extension/issues) to report bugs:

- **Clear Title**: Briefly describe the issue
- **Reproduction Steps**: How to reproduce the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, extension version
- **Screenshots/Logs**: Include any relevant attachments

### Code of Conduct

All contributors must adhere to:
- Be respectful and inclusive
- Provide constructive feedback
- Accept criticism gracefully
- Focus on what's best for the community

---

## Roadmap

### Version 1.0 (Current)
- [x] Basic extension setup and structure
- [x] Core functionality implementation
- [x] Popup UI and styling
- [x] Options page with settings
- [x] Local storage integration
- [ ] Bug fixes and optimization
- [ ] Final testing and QA

### Version 1.1 (Planned)
- [ ] Dark mode support
- [ ] Additional language support (i18n)
- [ ] Enhanced settings customization
- [ ] Performance improvements
- [ ] User feedback form

### Version 1.2 (Planned)
- [ ] Sync storage across devices
- [ ] Advanced filtering options
- [ ] Export/import settings
- [ ] Keyboard shortcuts
- [ ] Context menu integration

### Version 2.0 (Future)
- [ ] Major UI redesign
- [ ] API integration with portal services
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Batch operations support

### Under Consideration
- [ ] Mobile browser support
- [ ] Enterprise features
- [ ] Integration with other tools
- [ ] Custom themes marketplace
- [ ] Community plugin system

---

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Add-on Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Web APIs Reference](https://developer.mozilla.org/en-US/docs/Web/API)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

---

## Support

If you need help:

1. **Check the Troubleshooting Guide** above
2. **Search existing Issues** for similar problems
3. **Create a new Issue** with detailed information
4. **Contact the Maintainer**: Open a discussion in the repository

---

## Acknowledgments

- Thanks to all contributors who have helped improve this project
- Built with ❤️ for the community

---

**Last Updated**: January 9, 2026

**Current Maintainer**: [muhammadaliafzal205](https://github.com/muhammadaliafzal205)
