const list = document.getElementById("popup-list");

const popupBody = document.getElementById("popup-body");
const noteBody = document.getElementById("note-body");

const newNoteBtn = document.getElementById("new-note");
const loginBtn = document.getElementById("login");
const copyButton = document.getElementById("popup-copy");
const clearButton = document.getElementById("clear-data");


// LIST FETCHER
const fetchList = () => {
  // send message
  chrome.runtime.sendMessage({ action: "fetch_list" });
}


// LOGIN CHECK
const loginCheck = () => {
  fetch("http://localhost:3000/api/v1/login", {
    method: "post",
    headers: {
        'Content-Type': 'application/json',
        // 'X-User-Email': formData.get("email"),
        // 'X-User-Token': formData.get("password"),
    }
  }).then(res => {
    if (res.status != 200) {
      console.log("Failed Login");
      return;
    }

    newNoteBtn.classList.remove("hidden")
    login.classList.add("hidden")
    res.json().then(data => console.log(data));

    console.log("success");
  });
}


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

const toggleBody = () => {
  popupBody.classList.toggle("hidden");
  noteBody.classList.toggle("hidden");
}


// CREATE NOTE SUCCESS
const createSuccess  = (message) => {
  document.getElementById("note-title").textContent = `:)${message}`;
  toggleBody();
};


// EVENT-LISTENERS

// CLEAR STORAGE
clearButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "clear_data" }, (response) => {
    if (response.code === "success") {
      list.innerHTML = "";
    }
  });
});

// COPY TEXT TO CLIPBOARD
copyButton.addEventListener("click", () => {
  // console.log("innerText: ",)
  if (list.innerText) {
    navigator.clipboard.writeText(list.innerText);
  }
});

// GOTO NOTE-FORM
newNoteBtn.addEventListener("click", toggleBody);

// NOTE-FORM ONSUBMIT
document.querySelector("#note-form").onsubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  console.log("NOTE FORM: ", formData);
  chrome.runtime.sendMessage({ action: "new_note", title: formData.get("title") });
};

// BACK TO POPUP
document.getElementById("back").addEventListener("click", toggleBody);

// ONDOMCONTENTLOADED
document.addEventListener("DOMContentLoaded", () => {
  fetchList();
  loginCheck();
});



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
  } else if (action === "try_copy") {
    navigator.clipboard.writeText(request.text);
  } else if (action === "create_success") {
    console.log("success");
    createSuccess(request.title);
  } else if (action === "login_failed") {
    window.open("http://localhost:3000/users/sign_in", "_blank").focus();
  }
});
