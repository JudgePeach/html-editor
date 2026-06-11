# 网页 HTML 编辑器浏览器插件 (HTML Editor Extension)

简体中文 | [English](README_EN.md)

---

这是一个支持多浏览器（Safari、Chrome、Edge、Firefox）的网页所见即所得（WYSIWYG）直接编辑插件。它能够一键将任何网页转换为“可编辑模式”（基于 `document.designMode`），支持直接在网页上修改文字内容，并通过快捷键 `Cmd + S` 将修改后的网页保存到本地。

我们针对 macOS Safari 浏览器进行了原生的 App 包装适配，同时也支持在 Chrome、Edge 和 Firefox 中通过解压包快速使用。

### 💡 开发背景与痛点 / Background & Motivation

随着生成式 AI 的普及，越来越多的人开始利用 AI 自动生成 HTML 格式的演示文稿（网页版 PPT）、单页网站或学习课件。然而，这也带来了以下痛点：
1. **代码门槛高**：AI 生成的 HTML 页面中如果存在错别字或微小的排版错误，非技术人员很难直接去修改 HTML 代码。
2. **AI 交互成本高**：如果每次修改几个字、微调一段文案都要发回给 AI 重新生成，不仅效率低下，还会**浪费大量的 Token** 资源。
3. **生态缺失与跨端兼容**：虽然 Chrome 和 Edge 的应用商店里已经有一些类似的网页编辑插件，但很多用户也经常在 **macOS 的 Safari** 以及其他浏览器中工作。市面上缺乏一个既能完美适配 Safari 原生生态、又能跨浏览器通用的轻量网页编辑与保存方案。

为了解决这个痛点，本项目采用标准 Web Extension 规范开发，既实现了 macOS Safari 的原生适配，也让 Chrome/Edge/Firefox 用户能够即装即用。

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

## 🚀 安装指南 (Installation Guide)

根据你使用的浏览器类型，选择以下对应的安装方式：

### 1️⃣ Chrome / Edge / Firefox 浏览器 (免编译，推荐)
由于这些浏览器支持直接加载未打包扩展，安装最为简单快捷：
1. **下载安装包**：在本项目根目录下载 [html-editor-chrome-firefox.zip](html-editor-chrome-firefox.zip) 并解压，得到 `Resources` 文件夹。
2. **进入扩展管理页**：
   - **Chrome**: 在地址栏输入 `chrome://extensions/`
   - **Edge**: 在地址栏输入 `edge://extensions/`
3. **启用“开发者模式”**：开启页面右上角（或左下角）的 **“开发者模式” (Developer mode)** 开关。
4. **加载扩展**：点击 **“加载已解压的扩展程序” (Load unpacked)** 按钮，选中解压出来的 `Resources` 文件夹。
5. **开始使用**：在浏览器工具栏点击该插件图标即可开启/关闭编辑模式，编辑完成后按 `Cmd + S` / `Ctrl + S` 快捷保存网页。

---

### 2️⃣ macOS Safari 浏览器 (需要本地编译或开发者签名)
根据 Safari 的安全机制，非应用商店下载的扩展必须经过苹果证书签名公证，或者通过 Xcode 进行本地调试注册：

#### 💡 方法 A：使用 Xcode 本地免费编译运行 (推荐，完全免费)
如果不想支付苹果每年 $99 的开发者账号费用，可以让有安装了 Xcode 的 Mac 用户自行本地编译：
1. **准备工作**：确保你的 Mac 上安装了 **Xcode**（可从 App Store 免费下载）。
2. **克隆项目**：
   ```bash
   git clone https://github.com/JudgePeach/html-editor.git
   cd html-editor
   ```
3. **打开项目**：双击打开 `html-editor.xcodeproj`。
4. **启用 Safari 开发菜单**：
   - 打开 Safari 浏览器 -> 菜单栏选择 `设置 (Settings)` -> `高级 (Advanced)`。
   - 勾选最下方的 `在菜单栏中显示“开发”菜单 (Show Develop menu in menu bar)`。
   - 点击 Safari 菜单栏的 `开发 (Develop)` -> 勾选 `允许未签名的扩展 (Allow Unsigned Extensions)`。
5. **编译运行**：
   - 在 Xcode 中，确保 Scheme 选择的是 `html-editor`，目标选择 `My Mac`。
   - 按下 `Cmd + R` 进行编译运行。
   - 运行后会弹出一个小 App 容器窗口，表示插件已被注册到系统，此时即可关闭该 App 窗口。
6. **启用插件**：
   - 回到 Safari，打开 `设置 (Settings)` -> `扩展 (Extensions)`。
   - 勾选 **HTML Editor for Safari** 启用它，并授予其对网页的访问权限。

> [!IMPORTANT]
> **⚠️ 本地测试版避坑指南 (必读)：**
> 
> 1. **防止插件因为清理缓存而消失**：
>    通过 Xcode 直接 `Cmd + R` 运行的 App 存放在临时缓存目录（DerivedData）。一旦 Xcode 缓存被清理，或者您关闭了 Xcode，Safari 可能会找不到插件。
>    **推荐做法**：编译成功后，在 Xcode 编译输出路径中找到 `html-editor.app`，或者前往 Xcode 的输出路径，将 `html-editor.app` 复制到您的系统的 `~/Applications` (或 `/Applications`) 目录中。这样它就成为了本地永久安装的 App，绝不会再次因缓存清理而丢失。
> 2. **Safari 重启后插件隐去的问题**：
>    出于安全考虑，Safari 每次**彻底退出并重新打开**（例如重启 Mac 或手动 `Cmd + Q`）之后，都会自动重置并**关闭“允许未签名的扩展”**这一开发者选项，导致插件在工具栏和设置中暂时隐藏。
>    **恢复方法**：您**不需要**重新打开 Xcode 编译，只需再次在 Safari 菜单栏点击 `开发 (Develop)` -> 勾选 `允许未签名的扩展 (Allow Unsigned Extensions)`，然后前往 `设置 -> 扩展` 重新勾选启用该插件即可。


#### 💡 方法 B：打包分发为独立免 Xcode 安装包 (需要付费开发者账号)
如果你拥有 **Apple Developer 开发者账号**（$99/年），你可以将其打包为独立的 `.dmg` 安装包分发给普通用户：
1. 在 Xcode 中，选择菜单栏 `Product` -> `Archive`。
2. 归档完成后，在 Organizer 中选择 `Distribute App` -> `Developer ID`。
3. 签名并提交苹果公证（Notarize）。
4. 导出后打包为 `.dmg` 文件，其他用户双击运行安装此 App 后，即可直接在 Safari 设置中激活该扩展，无需 Xcode 即可下载即用。

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
