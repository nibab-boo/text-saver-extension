// LIST FETCHER
const fetchList = () => {
    // send message
    chrome.runtime.sendMessage({ action: "fetch_list" });
}
const list = document.getElementById("popup-list");

document.addEventListener("DOMContentLoaded", () => {
  fetchList();
});

// ADDING LINE TO EXTENSION
const addLine = (message) => {
  const listItem = document.createElement("li");
  listItem.innerHTML = message;
  list.appendChild(listItem);
};

// Listening FOR MESSAGE
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {action, message, list} = request;
  if (action === "display_text" && message) {
    addLine(message);
  } else if (action === "display_list" && list) {
    list.forEach(text => addLine(text));
  }
});

// BUTTON TO CLEAR STORAGE
const clearButton = document.getElementById("clear-data");
clearButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "clear_data" }, (response) => {
    if (response.code === "success") {
      list.innerHTML = "";
    }
  });
});

// COPY TEXT TO CLIPBOARD
const copyButton = document.getElementById("popup-copy");
copyButton.addEventListener("click", () => {
  // console.log("innerText: ",)
  if (list.innerText) {
    navigator.clipboard.writeText(list.innerText);
  }
});
