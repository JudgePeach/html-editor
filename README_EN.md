# HTML Editor Extension (Cross-Browser)

[简体中文](README.md) | English

---

A cross-browser WYSIWYG web page editor extension supporting **Safari, Chrome, Edge, and Firefox**. It turns any web page into an interactive editor, allowing you to double-click and edit text inline without writing code, and save your modifications instantly via `Cmd + S`.

We have specially packaged and adapted it as a native App wrapper for macOS Safari, while also supporting quick loading on Chrome, Edge, and Firefox.

### 💡 Background & Motivation

With the rise of generative AI, more and more people are using AI to create HTML-formatted slide decks (web-based PPTs), single-page websites, or learning materials. However, this introduces several pain points:
1. **Coding Barrier**: If there's a typo or a minor layout bug, non-technical users find it hard to edit HTML source code directly.
2. **High Interaction Costs**: Sending files back to AI for minor adjustments is slow and **wastes a significant amount of tokens**.
3. **Ecosystem & Cross-Platform Gap**: While similar extensions exist in Chrome and Edge stores, many users work in macOS Safari as well as other browsers. There was a lack of a lightweight, cross-browser editing and saving solution that integrates natively with Safari.

To resolve these issues, this project is built conforming to the standard Web Extension specification. It provides native macOS Safari packaging while offering instant install-and-use capability for Chrome, Edge, and Firefox.

---

## 🌟 Key Features

- 🔄 **One-Click Edit Mode Toggle**: Click the extension icon in the toolbar to instantly switch between "Editing Mode" and "Normal Browsing Mode".
- ✍️ **WYSIWYG Editing**: Once enabled, all text, links, and media on the webpage can be clicked and edited, deleted, or inserted directly.
- 💾 **Smart Shortcut Saving (`Cmd + S`)**:
  - Automatically intercepts the browser's default save dialog and exports the latest DOM structure with your modifications.
  - **Smart Filename Extraction**: Automatically extracts the filename from the URL, resolves URL encoding (e.g. converting `%E9%9B%86%E5%90%88.html` to `集合.html`), and cleans query parameters or hashes.
  - **Local File Protocol (`file://`) Support**: For local HTML files, it generates a temporary Blob and opens it in a new window, prompting manual save; for `http://` / `https://` protocols, it triggers direct browser downloads.
- 🛡️ **Environment Isolation**: Event listeners are registered in the capturing phase of the Isolated World, preventing webpage scripts (e.g. keyboard navigation overrides) from hijacking your inputs.

---

## 📂 Project Structure

```text
├── html-editor              # macOS container app (registers the extension in Safari)
├── html-editor Extension    # Safari extension Swift wrapper and bridge
│   ├── SafariWebExtensionHandler.swift
│   └── Resources            # Core Web Extension assets (CRITICAL!)
│       ├── manifest.json    # Extension manifest (MV3)
│       ├── background.js    # Background service worker script
│       ├── content.js       # Content script (handles designMode and save logic)
│       ├── popup.html       # Popup window (simple template, triggered via Toolbar icon)
│       └── images/          # Icon resources
└── html-editor.xcodeproj    # Xcode project folder
```

---

## 🚀 Installation Guide

### 1. Installation on macOS Safari (Recommended)

Since Safari requires extensions to be embedded in a macOS app container, you can build and run it locally via Xcode:

1. **Prerequisites**: Make sure **Xcode** is installed on your Mac (available for free on the App Store).
2. **Clone the Project**:
   ```bash
   git clone <your-repository-url>
   cd html-editor
   ```
3. **Open Xcode**: Double-click `html-editor.xcodeproj` to open it in Xcode.
4. **Enable Safari Developer Mode**:
   - Open Safari -> Go to `Settings` -> `Advanced`.
   - Check the box for `Show Develop menu in menu bar` at the bottom.
   - Click the `Develop` menu in the Safari menu bar -> Check `Allow Unsigned Extensions`.
5. **Build and Run**:
   - In Xcode, select `html-editor` as the Scheme and target `My Mac`.
   - Press `Cmd + R` or click the play button to build and run.
   - A macOS App window will pop up indicating the extension is ready.
6. **Activate the Extension**:
   - Go back to Safari -> Open `Settings` -> `Extensions`.
   - Find **HTML Editor for Safari**, check it to enable, and grant permission to access webpages.

---

## 📦 Distribution & Packaging

Since Safari extensions require Apple Developer ID signing and notarization to run out-of-the-box on other Macs without developer options, here are the easiest ways to package and share:

### Option A: Package as Chrome / Edge / Firefox Extension (Universal & Free)
The core logic resides entirely in the standard Web Extension folder (`Resources`), meaning it can be run on other browsers:
1. Extract the `html-editor Extension/Resources` directory.
2. Compress it into a `.zip` file (e.g. `html-editor-extension.zip`).
3. **For others to install**:
   - Unzip the archive.
   - Open Chrome or Edge, navigate to `chrome://extensions/`.
   - Turn on **"Developer mode"** in the top right.
   - Click **"Load unpacked"** and select the unzipped `Resources` folder.

### Option B: Distribute as a Signed macOS App
If you have an **Apple Developer Account** ($99/year), you can sign and notarize the app wrapper:
1. In Xcode, select `Product` -> `Archive`.
2. Click `Distribute App` and select `Developer ID`.
3. Xcode will sign the bundle and submit it to Apple for **Notarization**.
4. Once approved, export it as a `.dmg` or `.zip` file. Others can run the App directly, and the extension will immediately appear in their Safari settings.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to modify, distribute, and use it for personal or commercial projects.
