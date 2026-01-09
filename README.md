# Flex Portal Extension

A powerful browser extension designed to enhance and extend the functionality of Flex Portal with additional features, improved workflow, and better user experience.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Chrome/Chromium](#chromechromium)
  - [Firefox](#firefox)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## ✨ Features

### Core Functionality
- **Enhanced Portal Interface**: Streamlined navigation and improved UI/UX
- **Quick Actions**: One-click access to frequently used features
- **Customizable Dashboard**: Personalize your portal experience
- **Data Management**: Efficient handling and organization of portal data
- **Search & Filter**: Advanced search and filtering capabilities
- **Dark Mode Support**: Easy on the eyes with optional dark theme

### Productivity Features
- **Keyboard Shortcuts**: Speed up your workflow with custom hotkeys
- **Auto-save**: Automatic saving of your work to prevent data loss
- **Notifications**: Real-time alerts for important events
- **History Tracking**: Keep track of your activities and changes
- **Export Functionality**: Export data in multiple formats (CSV, PDF, JSON)

### User Experience
- **Responsive Design**: Works seamlessly on different screen sizes
- **Offline Mode**: Limited functionality available even without internet
- **Multi-language Support**: Interface available in multiple languages
- **Accessibility**: WCAG compliant for better accessibility

## 📦 Installation

### Chrome/Chromium

#### From Chrome Web Store (if published)
1. Visit the [extension page on Chrome Web Store](#)
2. Click **"Add to Chrome"**
3. Review permissions and click **"Add extension"**
4. The extension icon will appear in your toolbar

#### From Source (Development Mode)
1. Clone or download this repository
   ```bash
   git clone https://github.com/muhammadaliafzal205/flex-portal-extension.git
   cd flex-portal-extension
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **"Developer mode"** (toggle in the top-right corner)

4. Click **"Load unpacked"**

5. Select the extension folder from your computer

6. The extension is now installed and ready to use!

### Firefox

#### From Firefox Add-ons (if published)
1. Visit the [add-on page on Mozilla Add-ons](#)
2. Click **"Add to Firefox"**
3. Review permissions and click **"Add"**
4. The extension will be activated automatically

#### From Source (Development Mode)
1. Clone or download this repository
   ```bash
   git clone https://github.com/muhammadaliafzal205/flex-portal-extension.git
   cd flex-portal-extension
   ```

2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`

3. Click **"Load Temporary Add-on"**

4. Select the `manifest.json` file from the extension folder

5. The extension is now loaded and ready to test!

## 🚀 Getting Started

### Initial Setup

1. **Install the Extension**: Follow the installation instructions above for your browser

2. **Grant Permissions**: When prompted, review and grant necessary permissions:
   - Access to Flex Portal pages
   - Storage of preferences and data
   - Notifications (optional)

3. **Open Flex Portal**: Navigate to your Flex Portal instance

4. **Customize Settings**: Click the extension icon → **Settings** to configure options

5. **Start Using**: Use the extension features integrated into the portal interface

### First Time User Tips

- Click the extension icon to view the popup menu with quick actions
- Check the **Settings** page to customize behavior and preferences
- Review the **Keyboard Shortcuts** section for quick productivity tips
- Enable notifications in settings for real-time updates

## 📖 Usage Guide

### Accessing the Extension

**Browser Toolbar**: Click the extension icon in your browser toolbar to open the popup menu

**Right-click Context Menu**: Right-click on any element to see context-specific options

**Keyboard Shortcuts**: Use configured hotkeys for quick access to features

### Main Features

#### 1. Dashboard
- View at-a-glance summary of your Flex Portal activity
- Quick access to frequently used features
- Customizable widgets and layout

#### 2. Search & Filter
- Use the advanced search bar to find items quickly
- Apply multiple filters simultaneously
- Save custom filter combinations for later use

#### 3. Quick Actions
Common actions accessible from the toolbar:
- Create new items
- Search portal data
- View notifications
- Access settings

#### 4. Data Export
Export your data in multiple formats:
- **CSV**: Compatible with Excel and spreadsheet applications
- **PDF**: Professional formatted documents
- **JSON**: Structured data for integration with other tools

To export:
1. Select items you want to export
2. Click the **Export** button
3. Choose your preferred format
4. Click **Download**

#### 5. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+F` | Open search dialog |
| `Ctrl+Shift+S` | Open settings |
| `Ctrl+Shift+E` | Toggle dark mode |
| `Ctrl+Shift+N` | View notifications |
| `Alt+Q` | Show quick actions |

*Note: Shortcuts may vary based on your OS and configuration*

## ⚙️ Configuration

### Settings Page

Access settings by clicking the extension icon → **Settings** or using `Ctrl+Shift+S`

#### General Settings
- **Dark Mode**: Enable/disable dark theme
- **Language**: Choose your preferred language
- **Auto-save**: Enable automatic saving interval
- **Notification**: Configure notification preferences

#### Advanced Settings
- **Custom Hotkeys**: Define custom keyboard shortcuts
- **Data Retention**: Set how long to keep historical data
- **Performance**: Optimize extension performance
- **Debug Mode**: Enable for troubleshooting

#### Privacy & Security
- **Data Storage**: Choose local or cloud storage
- **Encryption**: Enable data encryption
- **Auto-logout**: Set idle timeout duration
- **Clear Data**: Remove cached and stored data

### Backup & Restore

1. Go to **Settings** → **Backup & Restore**
2. Click **"Create Backup"** to download your settings
3. To restore, click **"Restore"** and select your backup file

## 🐛 Troubleshooting

### Common Issues

#### Extension not appearing in toolbar
- **Solution**: Check if the extension is enabled in your browser's extension settings
- Go to `chrome://extensions/` (Chrome) or `about:addons` (Firefox)
- Ensure the toggle switch next to the extension is ON

#### Permissions denied error
- **Solution**: Grant necessary permissions
- Click extension icon → **Re-grant Permissions**
- Or remove and reinstall the extension

#### Data not syncing
- **Solution**: Check your internet connection and browser settings
- Disable and re-enable the extension
- Clear browser cache and cookies for the portal domain
- Check Settings → **Sync Status**

#### Extension running slowly
- **Solution**: 
  - Go to Settings → Advanced → disable unnecessary features
  - Clear cached data: Settings → Privacy & Security → Clear Data
  - Restart your browser
  - Check system resources (RAM, CPU)

#### Settings not saving
- **Solution**:
  - Ensure browser storage is not full
  - Check if your browser allows storage for this site
  - Try clearing browser cache
  - Reinstall the extension

### Debug Mode

Enable debug mode for detailed logging:

1. Open Settings
2. Scroll to "Advanced Settings"
3. Enable "Debug Mode"
4. Check browser console for detailed logs: `F12` → Console tab

### Getting Help

- Check this README for solutions
- Review extension logs (Debug Mode)
- Contact support (see Support section below)
- Check issues on [GitHub Issues](https://github.com/muhammadaliafzal205/flex-portal-extension/issues)

## 👨‍💻 Development

### Project Structure

```
flex-portal-extension/
├── manifest.json          # Extension manifest
├── src/
│   ├── popup.html        # Popup interface
│   ├── popup.js          # Popup logic
│   ├── styles/           # CSS stylesheets
│   ├── content.js        # Content script
│   ├── background.js     # Background service worker
│   └── utils/            # Utility functions
├── icons/                # Extension icons
├── README.md             # This file
└── package.json          # Dependencies
```

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- Basic understanding of JavaScript and browser extensions

### Setup Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/muhammadaliafzal205/flex-portal-extension.git
   cd flex-portal-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Load the extension in your browser (see Installation section)

### Building the Extension

Build for production:
```bash
npm run build
```

This creates an optimized version in the `dist/` directory.

### Testing

Run tests:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Steps to Contribute

1. **Fork the repository** on GitHub

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and test them thoroughly

4. **Commit your changes**:
   ```bash
   git commit -m "Add description of your changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with a clear description of changes

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Write meaningful commit messages
- Test your changes before submitting PR
- Ensure all tests pass: `npm test`

### Reporting Bugs

1. Check if the issue already exists on [GitHub Issues](https://github.com/muhammadaliafzal205/flex-portal-extension/issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Detailed description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Feature Requests

Submit feature requests as GitHub issues with:
- Clear title describing the feature
- Detailed explanation of the feature
- Use cases and benefits
- Optional mockups or examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

### Getting Help

- **Documentation**: Check this README and in-app help
- **Issues**: Visit [GitHub Issues](https://github.com/muhammadaliafzal205/flex-portal-extension/issues)
- **Email**: Contact through GitHub profile
- **Discussion**: Use GitHub Discussions for general questions

### Reporting Security Issues

Do not open public issues for security vulnerabilities. Instead, please email security concerns directly (contact via GitHub profile).

---

## 📝 Version History

### v1.0.0 (Initial Release)
- Initial release with core features
- Dark mode support
- Export functionality
- Keyboard shortcuts

---

**Last Updated**: 2026-01-09

For the latest information and updates, visit our [GitHub repository](https://github.com/muhammadaliafzal205/flex-portal-extension).
