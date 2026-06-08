// Global Toast display helper
function showToast(message) {
    let container = document.getElementById('html-editor-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'html-editor-toast-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '2147483647',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif'
        });
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
        minWidth: '200px',
        padding: '12px 20px',
        backgroundColor: 'rgba(28, 28, 30, 0.85)',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        webkitBackdropFilter: 'blur(12px)',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'auto',
        textAlign: 'center',
        lineHeight: '1.4'
    });

    container.appendChild(toast);

    // Force layout recalculation for CSS transition
    toast.offsetHeight;

    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.addEventListener('transitionend', () => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        });
    }, 2000);
}

// Ensure keydown handler is defined globally on window (isolated world) to prevent duplicates
if (!window.__htmlEditorKeyDownHandler) {
    window.__htmlEditorKeyDownHandler = function(event) {
        // Detect Cmd + S (event.metaKey is CMD on macOS, event.key is 's')
        if (event.metaKey && event.key.toLowerCase() === 's') {
            console.log("HTML Editor: Detected Cmd + S shortcut!");
            event.preventDefault();

            // 1. Extract and decode filename first
            let filename = "edited_index.html";
            try {
                const pathname = window.location.pathname;
                const lastPart = pathname.substring(pathname.lastIndexOf('/') + 1);
                if (lastPart && lastPart.trim() !== "") {
                    // Extract filename, clean parameters and hashes, resolve extension
                    let baseName = lastPart.split('?')[0].split('#')[0];
                    baseName = decodeURIComponent(baseName); // Decode URL encoding (e.g. %E9%9B%86%E5%90%88 -> 集合)
                    if (baseName && baseName.trim() !== "") {
                        if (/\.html?$/i.test(baseName)) {
                            filename = baseName;
                        } else {
                            const dotIndex = baseName.lastIndexOf('.');
                            if (dotIndex !== -1) {
                                filename = baseName.substring(0, dotIndex) + ".html";
                            } else {
                                filename = baseName + ".html";
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Error generating filename: ", e);
            }

            // Fallback check
            if (!filename || filename.trim() === "" || filename === ".html") {
                filename = "edited_index.html";
            }

            // 2. Temporarily set the document title to the filename so Safari's save dialog defaults to the filename.
            // We strip the extension because Safari automatically appends the correct extension based on save format.
            const originalTitle = document.title;
            const suggestedTitle = filename.replace(/\.html?$/i, "");
            document.title = suggestedTitle;

            // 3. Grab current HTML code
            const doctype = document.doctype;
            let doctypeString = "<!DOCTYPE html>\n";
            if (doctype) {
                try {
                    doctypeString = new XMLSerializer().serializeToString(doctype) + "\n";
                } catch (e) {
                    console.warn("Failed to serialize doctype: ", e);
                }
            }
            const htmlContent = doctypeString + document.documentElement.outerHTML;

            // Restore the original title immediately so the active editing tab's title doesn't change permanently.
            document.title = originalTitle;

            // 3. Save or Open depending on protocol
            if (window.location.protocol === "file:") {
                console.log("HTML Editor: Local file:// protocol detected. Opening Blob URL in a new tab.");
                try {
                    // Create a Blob and open its URL in a new tab.
                    // Safari allows opening blob: URLs and supports saving their "Page Source" (unlike data: URLs which are blocked or about:blank which is empty).
                    const blob = new Blob([htmlContent], { type: "text/html" });
                    const blobUrl = URL.createObjectURL(blob);
                    
                    const newWindow = window.open(blobUrl, "_blank");
                    if (newWindow) {
                        showToast("已在新页面打开，请按 Cmd+S 手动保存");
                    } else {
                        showToast("新页面被浏览器拦截，请允许弹窗");
                    }
                } catch (err) {
                    console.error("HTML Editor: Failed to generate Blob URL: ", err);
                    showToast("生成保存页面失败，请检查控制台");
                }
            } else {
                // HTTP/HTTPS protocols - trigger automatic download
                const blob = new Blob([htmlContent], { type: "text/html" });
                const blobUrl = URL.createObjectURL(blob);

                console.log("HTML Editor: Generating download link for: ", filename);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = filename;
                
                // Safari blocks clicks on elements with display: none. 
                // We use opacity: 0 and absolute positioning instead.
                link.style.position = "absolute";
                link.style.opacity = "0";
                link.style.pointerEvents = "none";
                
                document.body.appendChild(link);
                
                console.log("HTML Editor: Triggering link click download.");
                link.click();

                // Clean up with a delay to prevent Safari from cancelling the download
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                    console.log("HTML Editor: Cleaned up download link and revoked Blob URL.");
                }, 200);

                // Show confirmation Toast
                showToast("修改已保存至下载目录");
            }
            
            event.stopPropagation();
            return;
        }

        // Prevent the webpage's own shortcut listeners from intercepting keypresses (like Space or Arrow keys)
        // this stops propagation but still allows browser default editing behavior (typing/moving cursor)
        event.stopPropagation();
    };
}

// State switching & keydown listener registration
(function() {
    const currentMode = (document.designMode || 'off').toLowerCase();
    const newMode = (currentMode === 'on') ? 'off' : 'on';
    document.designMode = newMode;

    if (newMode === 'on') {
        // Register keydown listener in capturing phase on window to intercept before any page scripts
        window.addEventListener('keydown', window.__htmlEditorKeyDownHandler, true);
        showToast("编辑模式：开启");
    } else {
        // Clean up event listener when turning off edit mode
        window.removeEventListener('keydown', window.__htmlEditorKeyDownHandler, true);
        showToast("编辑模式：关闭");
    }
})();
