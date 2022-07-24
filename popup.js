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

// HIGHLIGHT the list items
const highlightItem = (position) => {
  const highlighted = document.querySelector(".highlighted");
  const listItems = document.querySelectorAll("li");

  if (highlighted) highlighted.classList.remove("highlighted");
  if (position != null) listItems[position].classList.add("highlighted");
};

// Listening FOR MESSAGE
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {action, message, list} = request;
  if (action === "display_text" && message) {
    addLine(message);
  } else if (action === "display_list" && list) {
    list.forEach(text => addLine(text));
    highlightItem(request.position);
  } else if (action === "highlight_item") {
    const { position, text } = request;
    highlightItem(position);
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
