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

// listening to command
chrome.commands.onCommand.addListener((command) => {
    //TODO handle event
    console.log("Inside Command!");
    // getting current TabId
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (command === "copy") {
            // Finds tabs that are active in the current window
            chrome.tabs.sendMessage(tabs[0].id, { action: "get_text" }); // Sends a message (object) to the first tab (tabs[0])
        };
    });
});