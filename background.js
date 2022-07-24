// CUSTOM POPUP LOAD
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     console.log("check URL: ", (/^https:\/\/www.google.com/.test(tab.url)));

//     if (/^https:\/\/www.google.com/.test(tab.url)) {  
//         chrome.action.setPopup({ popup: "./popup.html"})
//     } else {
//         chrome.action.setPopup({ popup: "" })
//     }
// });


// Send Text To POPOUT.js
const sendText = (message) => {
    // storing in storage
    chrome.storage.sync.get(['list'], (result) => {
        let list = [];

        if (result.list) {
            list = JSON.parse(result.list);
        }
        
        chrome.storage.sync.set({list: JSON.stringify([...list, message])});
    });
    chrome.runtime.sendMessage({ action: "display_text", message: message })
}

const sendList = () => {
    chrome.storage.sync.get(["list", "position"], (result) => {
        let list = [];
        let position = result.position || 0;
        
        if (result.list) {
            list = JSON.parse(result.list);
        }
        chrome.runtime.sendMessage({ action: "display_list", list: list, position: JSON.parse(position) });
    });
}

// Change Focus
const changeFocus = (movement) => {
    if (!movement) return;
    
    chrome.storage.sync.get(["list", "position"], async (result) => {
        const list = result.list ? JSON.parse(result.list) : null;
        // checking if list exists or not
        if (list && list.length > 0) {
            // Taking previous position
            const prePosition = result.position ? JSON.parse(result.position) : list.length;
            let position;
            // changing value according to value
            if (movement === "down") {
                position = prePosition + 1;
            } else {
                position = prePosition - 1;
            }

            // Safety check for overflowing POSITION
            if (position >= list.length) position = 0;
            if (position < 0) position = list.length - 1

            const text = list[position];
            console.log("item", list[position]);
            await chrome.storage.sync.set({position: JSON.stringify(position)});
            await chrome.runtime.sendMessage({ action: "highlight_item", position: position, text: text });
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "copy_text", text: text })
            });
        }
    });
}


    














// LISTENING FOR COMMANDS
chrome.commands.onCommand.addListener((command) => {
    // Finds tabs that are active in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (command === "copy") {
            // message to FOREGROUND.js
            chrome.tabs.sendMessage(tabs[0].id, { action: "get_text" });
        }
        else if (command === "index1") {
            console.log("command: ", command);
            changeFocus("up")
        }
        else if (command === "index2") {
            console.log("command: ", command);
            changeFocus("down")
        }

    });
});


// LISTENING FOR MESSAGES
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "receive_test") {
        sendText(request.message);
    } else if (request.action === "fetch_list") {
        sendList();
    } else if (request.action === "clear_data") {
        chrome.storage.sync.set({list: "[]"});
        sendResponse({ code: "success" })
    }
});