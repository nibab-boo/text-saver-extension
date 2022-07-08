
const textFinder = () => {
  let selectedText = '';
  // document.getSelection
  if (document && document.getSelection) {
    selectedText = window.getSelection().toString();
  }
  // window.getSelection
  else if (window && window.getSelection) {
  }
  // document.selection
  else if (document && document.selection) {
    selectedText = document.selection.createRange().text;
  } else return;
  return selectedText
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("message", request.action);
  if (request.action === "get_text") {
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          // message to FOREGROUND.js
          // Sends a message (object) to the first tab (tabs[0])
          chrome.runtime.sendMessage({ action: "receive_test", message: textFinder() });
    // });
  };
});