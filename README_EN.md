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

Choose the appropriate installation method based on the browser you use:

### 1️⃣ Chrome / Edge / Firefox (No Compilation, Recommended)
Since these browsers support direct loading of unpacked extensions, this is the quickest and easiest way:
1. **Download the Extension**: Download [html-editor-chrome-firefox.zip](html-editor-chrome-firefox.zip) from the repository root and extract it to get the `Resources` folder.
2. **Open Extensions Manager**:
   - **Chrome**: Go to `chrome://extensions/`
   - **Edge**: Go to `edge://extensions/`
3. **Enable "Developer Mode"**: Toggle the **"Developer mode"** switch in the top right (or sidebar).
4. **Load Extension**: Click the **"Load unpacked"** button and select the extracted `Resources` folder.
5. **Start Using**: Click the extension icon in the toolbar to toggle edit mode, and press `Cmd + S` / `Ctrl + S` to save your modifications.

---

### 2️⃣ macOS Safari (Requires Local Compilation or Developer Signature)
Under Safari's security rules, extensions distributed outside the App Store must be signed by Apple or compiled locally using Xcode:

#### 💡 Method A: Compile Locally with Xcode (Recommended, 100% Free)
If you don't have a paid developer account, you can build the container app locally:
1. **Prerequisites**: Make sure **Xcode** is installed on your Mac (available for free on the App Store).
2. **Clone the Project**:
   ```bash
   git clone https://github.com/JudgePeach/html-editor.git
   cd html-editor
   ```
3. **Open Project**: Double-click `html-editor.xcodeproj` to open it in Xcode.
4. **Enable Safari Developer Menu**:
   - Open Safari -> Go to `Settings` -> `Advanced`.
   - Check the box for `Show Develop menu in menu bar` at the bottom.
   - Click the `Develop` menu in the Safari menu bar -> Check `Allow Unsigned Extensions`.
5. **Build and Run**:
   - In Xcode, select `html-editor` as the Scheme and target `My Mac`.
   - Press `Cmd + R` to build and run the project.
   - Once compiled, a small macOS App container window will open indicating the extension is registered. You can close this window now.
6. **Activate the Extension**:
   - Go back to Safari -> Open `Settings` -> `Extensions`.
   - Find **HTML Editor for Safari**, check it to enable, and grant it permissions to access webpages.

> [!IMPORTANT]
> **⚠️ Local Sandbox & Persistence Tips (Must-Read):**
> 
> 1. **Prevent Extension from Disappearing due to Cache Cleanup**:
>    Apps run directly via Xcode `Cmd + R` reside in Xcode's temporary build directory (`DerivedData`). If Xcode cleans its cache or you delete build folders, Safari will lose track of the extension.
>    **Recommended Action**: After building successfully, locate `html-editor.app` (under the Xcode build outputs) and copy it into your user's `~/Applications` (or system's `/Applications`) directory. This permanently registers the app, preventing it from disappearing.
> 2. **Safari Restart Reset Issue**:
>    Every time you **completely quit and relaunch Safari** (or restart your Mac), Safari automatically resets and **disables the "Allow Unsigned Extensions"** option in the Develop menu for security. This causes the extension to disappear from the toolbar and settings.
>    **How to Restore**: You **do not need** to open Xcode or recompile. Simply click Safari's menu bar -> `Develop` -> check `Allow Unsigned Extensions` again, then go to Safari `Settings` -> `Extensions` and re-enable it.


#### 💡 Method B: Distribute as a Standalone App (Requires Paid Developer Account)
If you have an **Apple Developer Account** ($99/year), you can export a signed app package for others to download and use instantly:
1. In Xcode, select `Product` -> `Archive`.
2. Select `Distribute App` -> `Developer ID`.
3. Sign and submit the build to Apple for **Notarization**.
4. Once notarized, export it as a `.dmg` or `.zip` file. Others can run the App directly without Xcode, and the extension will immediately show up in Safari settings.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to modify, distribute, and use it for personal or commercial projects.
