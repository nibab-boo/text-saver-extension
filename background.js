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
    if (movement === "up") {
        chrome.storage.sync.get(["list", "position"], (result) => {
            const list = result.list ? JSON.parse(result.list) : null;
            if (list && list.length > 0) {
                const position = (result.position != null) ? JSON.parse(result.position) + 1 : 0;
                console.log("position", position)
                console.log("item", list[position]);
                chrome.storage.sync.set({position: JSON.stringify(position)});
            }
        });
    }
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