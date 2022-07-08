// LIST FETCHER
( () => {
    // send message
    chrome.runtime.sendMessage({ action: "fetch_text" });
  }
)();


const addLine = (message) => {
  const list = document.getElementById("popup-list")
  const listItem = document.createElement("li");
  listItem.innerHTML = message;
  list.appendChild(listItem);
};

// Listening to MESSAGE
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {action, message, list} = request;
  if (action === "display_text" && message) {
    addLine(message);
  } else if (action === "display_list" && list) {
    list.forEach(text => addLine(text));
  }
});

// BUTTON TO CLEAR STORAGE