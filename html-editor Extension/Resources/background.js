const tabStates = {}; // tabId -> state (true: ON, false: OFF)

browser.action.onClicked.addListener((tab) => {
    if (tab && tab.id) {
        const nextState = !tabStates[tab.id];
        tabStates[tab.id] = nextState;

        // Toggle icon and badge text
        if (nextState) {
            browser.action.setIcon({ path: "images/toolbar-icon.svg", tabId: tab.id });
            browser.action.setBadgeText({ text: "ON", tabId: tab.id });
            browser.action.setBadgeBackgroundColor({ color: "#34C759", tabId: tab.id }); // System green
        } else {
            browser.action.setIcon({ path: "images/toolbar-icon-inactive.svg", tabId: tab.id });
            browser.action.setBadgeText({ text: "", tabId: tab.id });
        }

        browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
            world: "MAIN"
        }).catch((err) => {
            console.error("Failed to execute content script: ", err);
        });
    }
});

// Reset extension button state when page is reloaded or navigated
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
        tabStates[tabId] = false;
        browser.action.setIcon({ path: "images/toolbar-icon-inactive.svg", tabId: tabId });
        browser.action.setBadgeText({ text: "", tabId: tabId });
    }
});
