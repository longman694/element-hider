# Element Hider

A simple browser extension to hide unwanted elements on web pages using CSS selectors. This extension allows you to customize your browsing experience by removing distracting or unnecessary parts of websites.

## Features

*   **Hide by CSS Selector:** Easily specify CSS selectors to hide elements on specific domains.
*   **Per-Domain Configuration:** Rules are saved and applied automatically for each website you configure.
*   **Popup & Options Page:** Manage your hiding rules conveniently from the extension's popup or a dedicated options page.
*   **Cross-Browser Compatible:** Designed to work with both Chrome and Firefox.

## Installation (for Development/Testing)

To install this extension temporarily in your browser for development or testing:

### Firefox

1.  Open Firefox.
2.  Type `about:addons` in the address bar and press Enter.
3.  Click the gear icon (⚙️) on the top right, then select "Debug Add-ons".
4.  Click the "Load Temporary Add-on..." button.
5.  Navigate to the directory of this project and select the `manifest.json` file.

The extension will be loaded until you close Firefox.

### Google Chrome

1.  Open Chrome.
2.  Type `chrome://extensions` in the address bar and press Enter.
3.  Enable "Developer mode" using the toggle switch in the top right corner.
4.  Click the "Load unpacked" button.
5.  Navigate to the directory of this project and select the entire folder.

The extension will be loaded. To reload it after making changes, click the refresh icon next to the extension.

## Usage

1.  **Navigate to a website** where you want to hide elements.
2.  **Click the Element Hider icon** in your browser's toolbar.
3.  In the popup, **enter the CSS selectors** (comma-separated) for the elements you wish to hide. For example: `div.ad-banner, #sidebar, .promo-section`.
4.  Click **"Save"**. The page will reload, and the specified elements will be hidden.
5.  You can manage all your rules via the **Options page** (accessible from the popup or `chrome://extensions` / `about:addons`).

## Building the Package

To create a distributable `.zip` file of the extension, run the `build.sh` script:

```bash
./build.sh
```

This will create a `dist` directory (if it doesn't exist) and place a `.zip` file (e.g., `dist/element-hider-v0.1.zip`) inside it. This `.zip` file can then be uploaded to the Chrome Web Store or submitted to the Firefox Add-ons store for signing.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
