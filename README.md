# Safari 网页 HTML 编辑器插件 (HTML Editor for Safari)

简体中文 | [English](README_EN.md)

---

这是一个专为 macOS Safari 浏览器深度适配的网页所见即所得（WYSIWYG）直接编辑插件。它能够一键将任何网页转换为“可编辑模式”（基于 `document.designMode`），支持直接在网页上修改文字内容，并通过快捷键 `Cmd + S` 将修改后的网页保存到本地。

### 💡 开发背景与痛点 / Background & Motivation

随着生成式 AI 的普及，越来越多的人开始利用 AI 自动生成 HTML 格式的演示文稿（网页版 PPT）、单页网站或学习课件。然而，这也带来了以下痛点：
1. **代码门槛高**：AI 生成的 HTML 页面中如果存在错别字或微小的排版错误，非技术人员很难直接去修改 HTML 代码。
2. **AI 交互成本高**：如果每次修改几个字、微调一段文案都要发回给 AI 重新生成，不仅效率低下，还会**浪费大量的 Token** 资源。
3. **Safari 生态缺失**：虽然 Chrome 和 Edge 的应用商店里已经有一些类似的网页编辑插件，但 **macOS 的 Safari 浏览器生态中一直缺乏一款原生的、好用的网页文本直接编辑插件**。

为了解决这个痛点，本项目开发了此款 Safari Web Extension，让用户可以像在 Word 中打字一样直接双击修改 Safari 中的网页内容，并用 `Cmd + S` 快捷保存。

---

## 🌟 主要功能

- 🔄 **一键开关编辑模式**：点击插件图标，即可快速在“编辑模式”和“普通浏览模式”之间切换。
- ✍️ **所见即所得编辑**：开启后，网页上的所有文本、链接、媒体均可直接点击编辑、删除或插入。
- 💾 **智能快捷键保存 (`Cmd + S`)**：
  - 自动拦截浏览器的默认保存行为，捕获最新的 DOM 结构（包括修改后的内容）。
  - **智能文件名提取**：自动根据网页 URL 提取最合适的文件名（解码 URL 编码，如将 `%E9%9B%86%E5%90%88.html` 还原为 `集合.html`），并自动清除 URL 参数及哈希值。
  - **本地文件协议 (`file://`) 支持**：对于本地打开的 HTML 文件，自动生成临时 Blob 并在新窗口打开，提示用户手动保存；对于 `http://` / `https://` 协议，直接触发浏览器下载到本地下载目录。
- 🛡️ **隔离环境与事件穿透**：核心的键盘监听事件注册在浏览器的隔离沙箱（Isolated World）捕获阶段，防止网页自带的脚本（如空格、方向键监听）干扰编辑器的正常输入。

---

## 📂 项目结构

```text
├── html-editor              # macOS 容器应用程序（负责在 Safari 中注册该插件）
├── html-editor Extension    # Safari 插件原生成本及通信网关
│   ├── SafariWebExtensionHandler.swift
│   └── Resources            # 核心 Web Extension 资源目录（关键！）
│       ├── manifest.json    # 扩展配置文件 (MV3)
│       ├── background.js    # 后台服务脚本
│       ├── content.js       # 内容注入脚本（编辑与保存的核心逻辑）
│       ├── popup.html       # 弹出悬浮窗（本插件主要以 Toolbar 图标激活，Popup 简易）
│       └── images/          # 图标资源
└── html-editor.xcodeproj    # Xcode 项目文件
```

---

## 🚀 安装与部署指南

### 1. 作为 Safari 浏览器插件安装（macOS）

由于 Safari 插件要求必须嵌入在一个 macOS 应用程序中，你可以使用 Xcode 在本地直接编译并启用它：

1. **准备工作**：确保你的 Mac 上安装了 **Xcode**（可从 App Store 免费下载）。
2. **克隆项目**：
   ```bash
   git clone <你的 GitHub 仓库地址>
   cd html-editor
   ```
3. **打开项目**：双击打开 `html-editor.xcodeproj`。
4. **开启 Safari 开发者模式**：
   - 打开 Safari 浏览器 -> 菜单栏选择 `设置 (Settings)` -> `高级 (Advanced)`。
   - 勾选最下方的 `在菜单栏中显示“开发”菜单 (Show Develop menu in menu bar)`。
   - 点击 Safari 菜单栏的 `开发 (Develop)` -> 勾选 `允许未签名的扩展 (Allow Unsigned Extensions)`。
5. **编译运行**：
   - 在 Xcode 中，确保 Scheme 选择的是 `html-editor`，目标选择 `My Mac`。
   - 按下 `Cmd + R` 或点击左上角的运行按钮。
   - 编译成功后会弹出一个 macOS App 窗口，提示你插件已就绪。
6. **启用插件**：
   - 回到 Safari，打开 `设置 (Settings)` -> `扩展 (Extensions)`。
   - 找到 **html-editor Extension**，勾选启用，并授予其对网页的访问权限。

---

## 📦 如何打包为他人可直接安装的包？

由于 Safari 的安全限制，非开发者自己编译的 Safari 插件需要经过苹果官方的签名签名（Developer ID）和公证（Notarization），或者发布到 Mac App Store。如果你希望更方便地分发给他人，有以下几种最简便的方案：

### 方案 A：打包为 Chrome/Firefox/Edge 扩展包（推荐，最普适）
因为本插件的核心是标准的 Web Extension（位于 `Resources` 目录），任何人都可以直接使用它：
1. 将 `html-editor Extension/Resources` 目录单独提取出来。
2. 将其压缩为 `.zip` 文件，即可作为 Chrome/Firefox 的离线安装包。
3. **他人安装方法**：
   - 解压 zip 文件。
   - 打开 Chrome/Edge，进入 `chrome://extensions/`。
   - 开启右上角的 **“开发者模式” (Developer mode)**。
   - 点击 **“加载已解压的扩展程序” (Load unpacked)**，选择刚刚解压的 `Resources` 文件夹即可。

### 方案 B：打包为 macOS 应用程序单独分发
如果你有 **Apple Developer 开发者账号**（$99/年），你可以直接打包导出一个 `.dmg` 或 `.zip` 的 macOS 应用：
1. 在 Xcode 中，选择菜单栏 `Product` -> `Archive`。
2. 归档完成后，在 Organizer 中选择 `Distribute App`。
3. 选择 `Developer ID` 或 `Direct Distribution`，使用你的开发者证书进行签名并提交苹果公证（Notarize）。
4. 导出后打包为 `.dmg`，其他人下载解压后，将应用拖入“应用程序”文件夹运行一次，即可在 Safari 扩展设置中看到并启用它。

> [!NOTE]
> 如果接收者也安装了 Xcode，最简单的方法是让他们直接用 Xcode 打开本项目，按 `Cmd + R` 运行一次，这不需要付费开发者账号。

---

## 🛠️ 技术细节说明

### 编辑模式实现
本插件在点击时切换 `document.designMode` 的状态：
- 当开启时，`document.designMode = 'on'`，使得整个页面像一个富文本编辑器。
- 此时我们向 `window` 注册了一个具有最高优先级的 `keydown` 监听器（处于 Capturing 阶段，并且使用 `event.stopPropagation()`），这保证了用户在网页内输入时光标能够正常移动，且打字不会意外触发网页自身绑定的热键。

### Cmd + S 拦截与 DOM 导出
当检测到 `Cmd + S` 时，插件会：
1. 序列化当前的 `document.doctype`（如果是标准 HTML5 则是 `<!DOCTYPE html>`）。
2. 将其与 `document.documentElement.outerHTML` 拼接，生成完整的、包含用户所有修改的 HTML 代码。
3. 通过 `URL.createObjectURL(new Blob(...))` 创建文件下载链接，自动触发保存。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源，欢迎自由修改、分发及商业使用。
