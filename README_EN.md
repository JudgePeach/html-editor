# HTML Editor for Safari

简体中文 | [English](README_EN.md)

---

A native Safari Web Extension for macOS that enables direct, real-time HTML editing right inside your Safari window. It turns any web page into an interactive WYSIWYG editor, allowing you to double-click and edit text inline without writing code, and save changes instantly via `Cmd + S`. It is the perfect tool for fine-tuning AI-generated HTML pages and slides, saving you from tedious code edits and unnecessary AI token consumption.

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
