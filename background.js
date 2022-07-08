// INJECT FOREGROUND.js to access user html
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {  
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./foreground.js"]
        })
            .then(() => {
                console.log("INJECTED THE FOREGROUND SCRIPT.");
            })
            .catch(err => console.log(err));
    }
});


// Calls POPOUT.js with text
const callPopout = (message) => {
    // chrome.tabs.sendMessage(tabs[0].id, )
    console.log("message:", message);
    chrome.runtime.sendMessage({ action: "display_text", message: message })
}

// listening to command
chrome.commands.onCommand.addListener((command) => {
    //TODO handle event

    // Finds tabs that are active in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (command === "copy") {

            // message to FOREGROUND.js
            // Sends a message (object) to the first tab (tabs[0])
            chrome.tabs.sendMessage(tabs[0].id, { action: "get_text" });
        };
    });
});


// listening to message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "receive_test") {
        callPopout(request.message);
    }
});