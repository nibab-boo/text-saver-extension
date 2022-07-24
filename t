[1mdiff --git a/background.js b/background.js[m
[1mindex c3723e8..e1a46e5 100644[m
[1m--- a/background.js[m
[1m+++ b/background.js[m
[36m@@ -7,13 +7,14 @@[m
 //     } else {[m
 //         chrome.action.setPopup({ popup: "" })[m
 //     }[m
[32m+[m
 // });[m
 [m
 [m
 // Send Text To POPOUT.js[m
 const sendText = (message) => {[m
     // storing in storage[m
[31m-    chrome.storage.sync.get(['list'], (result) => {[m
[32m+[m[32m    chrome.storage.sync.get(["list"], (result) => {[m
         let list = [];[m
 [m
         if (result.list) {[m
[36m@@ -60,12 +61,12 @@[m [mconst changeFocus = (movement) => {[m
             if (position < 0) position = list.length - 1[m
 [m
             const text = list[position];[m
[31m-            console.log("item", list[position]);[m
[32m+[m[32m            // console.log("item", list[position]);[m
             await chrome.storage.sync.set({position: JSON.stringify(position)});[m
[31m-            await chrome.runtime.sendMessage({ action: "highlight_item", position: position, text: text });[m
             chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {[m
[31m-              chrome.tabs.sendMessage(tabs[0].id, { action: "copy_text", text: text })[m
[32m+[m[32m              if (tabs[0]?.id) chrome.tabs.sendMessage(tabs[0].id, { action: "copy_text", text: text })[m
             });[m
[32m+[m[32m            await chrome.runtime.sendMessage({ action: "highlight_item", position: position, text: text });[m
         }[m
     });[m
 }[m
