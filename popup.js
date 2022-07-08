chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {action, message} = request;
  console.log("HELLO");
  if (action === "display_text") {
    console.log("(POPUP) message:", message);
  }
});

console.log("HELER");
