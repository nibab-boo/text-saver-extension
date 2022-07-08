
const textFinder = () => {
  var selectedText = '';
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
  console.log("SELECTED TEXT: ", selectedText);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("message", request.action);
  if (request.action === "get_text") textFinder();
});