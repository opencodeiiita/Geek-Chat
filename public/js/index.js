const socket = io();
const roomName = document.querySelector("#room-name");
const users = document.querySelector("#users");
const roomNameDiv = document.querySelector(".room-name-container");
const userMap = new Map();
const CURRENT_USER = sessionStorage.getItem("current_user");
const colors = ["F4C430","E02401","F037A5","A9333A","800080","FFA400","D8345F"]
var room;
var cntr=1, rCntr=1;
function randColor() {
  const c = Math.floor(Math.random() * 7);
  return colors[c];
}
//function to display truncated text
function readMore(num) {
  document.getElementById(`s${num}`).classList.add("extra")
  document.getElementById(`${num}xtra`).className = '';
  document.getElementById(`${num}link`).classList.add("extra");

  scrollToBottom();
}

socket.on("roomJoined", (connectionObj) => {
  room = connectionObj.room;
  roomName.innerHTML = connectionObj.room;
  roomNameDiv.classList.remove("animate");
});
socket.on("message", (message) => {
  if (
    document.querySelector(".typing") != null ||
    document.querySelector(".typing") != undefined
  ) {
    document.querySelector(".typing").remove();
    TYPING_USERS = [];
  }
  let userID = socket.id;
  outputMessage({ message, userID });
});

function outputMessage(msg) {
  var values = Object.values(msg);
  // console.log(values[0].text);
  var color = sessionStorage.getItem(values[0].username);
  const div = document.createElement("div");
  const mssgProfilePhoto = document.createElement("img");
  const div1 = document.createElement("div");
  mssgProfilePhoto.src = values[0].profilePhoto;
  mssgProfilePhoto.classList.add("userAvatar1");
  div.setAttribute("id", values[0].id);
  div1.setAttribute("id", `${values[0].id}-topDiv`);
  let trnc = false;
  if (values[0].userID === values[1]) {
    div.classList.add("author");
    div1.classList.add("profileRight");
    div.innerHTML += `<div class="btn-container hide"><button class="btn-danger2" onclick="deleteMsg('${values[0].id}')"><span class="material-icons">
        delete
        </span></button>
        <button class="btn-danger2 btn-danger-edit" onclick="editMsg('${values[0].id}')"><span class="material-icons">
        edit
        </span></button></div>`;
    playSound("send");
  } else {
    div.classList.add("message");
    div1.classList.add("profileLeft");
    if (values[0].username === "GeekChat Bot") {
      playSound("bot");
    } else {
      playSound("recieve");
    }
  }
  if (values[0].username === "GeekChat Bot") {
    div.classList.add("bot");
    if (values[0].profilePhoto !== "") {
      div.appendChild(mssgProfilePhoto);
      div.classList.add("profileAdded");
    }
    div.innerHTML += `<p class="meta">${values[0].username} <span>${moment(
      values[0].time
    ).format("h:mm a")}</span></p>
        <div class="text">
        ${values[0]["text"]}
        </div>`;
    playSound("bot");
  } else {
    
    if (div.classList.contains("author")){ 
      color= "000000";
    }
    var temp = document.createElement("div");
    temp.innerHTML = values[0].text;
    div.innerHTML += `
    <button class="btn-danger btn-danger-reply" onclick="replyMsg('${
      values[0].id
    }')"><span class="material-icons">
        reply
    </span></button>
    <p class="meta" style="color: #${color};">${values[0].username} <span>${moment(
      values[0].time
    ).format("h:mm a")}</span></p>`
    //check if its a replied message
    if(temp.children.length < 2 ) {
      //if more than 50 characters , we truncate the message
      var lgMsg = values[0].text;
      let pText = document.createElement('p');
      pText.innerHTML = lgMsg.substring(3,lgMsg.length-5);
      if (pText.innerText.length <= 50) {
        div.innerHTML += `<div class="text">
        ${values[0].text}
        </div>`;
      } else {
        trnc = true;
        var seenMsg = pText.innerText.substring(0,49);
        // var extraMsg = pText.innerText.substring(49,);
          div.innerHTML += `<div class='text'><p><span class='seen' id='s${cntr}'>
          ${seenMsg}</span><span class='extra' id='${cntr}xtra'>${pText.innerHTML}</span><br>
          <span id='${cntr}link' style='color: blue; cursor :pointer;' onclick='readMore(${cntr});'>Read more</span></p>
          </div>`
          ++cntr;
        // }
      }
    } else {
      var msgCntr = temp.children[0].outerHTML;
      if (temp.children[1].innerText.length <= 50) {
        div.innerHTML += `<div class="text">${msgCntr}<p class="replied-msg">
        ${temp.children[1].innerText}</p>
        </div>`;
      } else {
        trnc = true;
        var longMsg = temp.children[1].innerText;
        var seenMsg = longMsg.substring(0,49);
        div.innerHTML += `<div class="text">${msgCntr}<p class="replied-msg"><span class='seen' id='s${cntr}'>
        ${seenMsg}</span><span class='extra' id='${cntr}xtra'>${temp.children[1].innerText}</span><br>
        <span id="${cntr}link" style="color: blue; cursor :pointer;" onclick="readMore(${cntr});">Read more</span></p>
        </div>`
        ++cntr;
      }
    }    
    div.innerHTML += `${
          values[0].userID === values[1]
            ? `<span class="material-icons three-dots-menu" onclick="menuOpen('${values[0].id}')">
        more_vert
        </span>`
            : ``
        }`;
  }
  if(trnc) {
    div.querySelector(".text").querySelector('p').classList.add('trnc');
  }
  let repliedMsgCheck = div
    .querySelector(".text")
    .querySelector(".replied-msg-container");
  if (repliedMsgCheck != null || repliedMsgCheck != undefined) {
    if (
      repliedMsgCheck.querySelector(".replied-msg") != null ||
      repliedMsgCheck.querySelector(".replied-msg") != undefined
    ) {
      repliedMsgCheck
        .querySelector(".replied-msg")
        .classList.remove("replied-msg");
    }
  }
  div1.appendChild(mssgProfilePhoto);
  div1.appendChild(div);
  if (values[0].username === "GeekChat Bot")
    document.querySelector(".chat-messages").appendChild(div);
  else document.querySelector(".chat-messages").appendChild(div1);
  scrollToBottom();
}

const form = document.getElementById("chat-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let allList = document.querySelectorAll(".btn-container");
  allList.forEach((item) => {
    // item.style['display'] = 'none';
    item.classList.add("hide");
  });

  if (isEditing.status) {
    return emitEditedText(e);
  }
  if (isReplying.status) {
    return emitReplyMsg(e);
  }

  const msg = e.target.elements.msg.value;
  let userID = socket.id;
  if (msg.trim() == "") {
  } else {
    socket.emit("chatMessage", { msg, userID });
  }

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  scrollToBottom();
});

function scrollToBottom() {
  document.querySelector(".chat-messages").scrollTop =
    document.querySelector(".chat-messages").scrollHeight;
}

socket.on("userList", (userList) => {
  // console.log(userList)
  for (let { name, session_id, profilePhoto } of userList) {
    userMap.set(session_id, name);
    let user = document.createElement("li");
    user.classList.add("fade-in");
    user.dataset.id = session_id;
    user.innerHTML = name;
    const profileImage = document.createElement("img"); // created an img element to add profile photo of each entering new user
    profileImage.src = profilePhoto;
    profileImage.classList.add("userAvatar");
    user.appendChild(profileImage);
    users.appendChild(user);
  }
});
socket.on("userJoined", ({ id, username, profilePhoto }) => {
  userMap.set(id, username);
  const user = document.createElement("li");
  user.classList.add("fade-in");
  user.dataset.id = id;
  user.innerHTML = username;
  sessionStorage.setItem(username, randColor());
  const profileImage = document.createElement("img"); // created an img element to add profile photo of each entering new user
  profileImage.src = profilePhoto;
  profileImage.classList.add("userAvatar");
  user.appendChild(profileImage);
  users.appendChild(user);
});

socket.on("userLeft", ({ id, username }) => {
  const user = document.querySelector(`[data-id="${id}"]`);
  if (user) user.classList.add("fade-out");
  setTimeout(() => {
    user.remove();
  }, 1500);
  userMap.delete(id, username);
});

socket.on("deleteMsgFromChat", (msgId) => {
  if (msgId == null || msgId == undefined) {
    return;
  }
  document.getElementById(msgId).remove();
  document.getElementById(`${msgId}-topDiv`).remove();
});

function deleteMsg(info) {
  let [name, id] = info.split("_");
  if (name === CURRENT_USER) {
    socket.emit("deleteChatMsg", info);
  }
}

const beep1 = document.getElementById("beep1");
const beep2 = document.getElementById("beep2");
const beep3 = document.getElementById("beep3");
const playSound = (beep) => {
  if (beep === "send") {
    return beep1.play();
  }
  if (beep === "bot") {
    return beep3.play();
  }
  return beep2.play();
};

//timeout for removing typing element from dom
var timeout;

//event for typing
socket.on("typing", (typingUser) => {
  //push user to typingusers array
  TYPING_USERS.push(typingUser);

  //remove duplicates
  TYPING_USERS = [...new Set(TYPING_USERS)];

  //append typing event msg
  appendTyping();

  //timeout to delete typing event
  if (timeout !== undefined) {
    clearTimeout(timeout);
  }
  if (
    document.querySelector(".typing") != null ||
    document.querySelector(".typing") != undefined
  ) {
    timeout = setTimeout(() => {
      document.querySelector(".typing").remove();
      TYPING_USERS = [];
    }, 3000);
  }
});

//list of typing users
var TYPING_USERS = [];

const emitTyping = () => {
  socket.emit("typing", { name: CURRENT_USER, room });
};

//function to append typing msg
const appendTyping = () => {
  //checking for existing typing element
  if (
    document.querySelector(".typing") != null ||
    document.querySelector(".typing") != undefined
  ) {
    let divEx = document.querySelector(".typing");

    //if found then changing its content
    if (TYPING_USERS.length > 2) {
      divEx.innerHTML = `<p class="typing-text">many people typing <span class="dot-animation"></span></p>`;
    } else if (TYPING_USERS.length > 1) {
      divEx.innerHTML = `<p class="typing-text">${TYPING_USERS.join(
        ", "
      )} are typing <span class="dot-animation"></span></p>`;
    } else if (TYPING_USERS.length <= 1) {
      divEx.innerHTML = `<p class="typing-text">${TYPING_USERS.join(
        ", "
      )} is typing <span class="dot-animation"></span></p>`;
    }

    return;
  }

  //create div
  let div = document.createElement("div");

  //add class
  div.classList.add("message", "typing");

  //check no. of users typing
  if (TYPING_USERS.length > 2) {
    div.innerHTML = `<p class="typing-text">many people typing <span class="dot-animation"></span></p>`;
  } else if (TYPING_USERS.length > 1) {
    div.innerHTML = `<p class="typing-text">${TYPING_USERS.join(
      ", "
    )} are typing <span class="dot-animation"></span></p>`;
  } else if (TYPING_USERS.length <= 1) {
    div.innerHTML = `<p class="typing-text">${TYPING_USERS.join(
      ", "
    )} is typing <span class="dot-animation"></span></p>`;
  }

  //apend element to dom
  document.querySelector(".chat-messages").appendChild(div);
  scrollToBottom();
};

/* EDITING MSG FEATURE */
var isEditing = { status: false, id: null };

const editMsg = (id) => {
  //set editing mode to true
  isEditing = { status: true, id: id };
  let isRepliedMsg = false;
  let prevMsgText = '';
  //get old text
  if (
    document
      .getElementById(id)
      .querySelector(".text")
      .querySelector(".replied-msg") != undefined ||
    document
      .getElementById(id)
      .querySelector(".text")
      .querySelector(".replied-msg") != null
  ) {
    isRepliedMsg = true;
  }
  const prevMsgPara = document
    .getElementById(id)
    .querySelector(".text")
    .querySelector(`${isRepliedMsg ? ".replied-msg" : "p"}`);

  if (prevMsgPara.classList.contains("trnc")) {
    prevMsgText = prevMsgPara.children[1].innerText;
  } else {
    prevMsgText = prevMsgPara.innerText;
  }
  //select input and put old text in input
  const inputEle = document.getElementById("msg");
  inputEle.value = prevMsgText;
  //set popup to inform user that he is editing
  const formContainer = document.querySelector(".chat-form-container");
  formContainer.classList.add("editing-form-container");
  //close btn
  let span = document.createElement("span");
  span.classList.add("material-icons", "replying-close-btn");
  span.innerText = "cancel";
  span.setAttribute("onclick", "cancelEdit()");
  //prepend
  formContainer.prepend(span);
  //focus
  inputEle.focus();
};

const emitEditedText = (e) => {
  //get msg text
  const msg = e.target.elements.msg.value;
  //check msg and emit
  if (msg.trim() == "") {
    isEditing = { status: false, id: null };
  } else {
    socket.emit("edited-msg", { text: msg, id: isEditing.id });
    isEditing = { status: false, id: null };
  }
  //remove popup
  const formContainer = document.querySelector(".chat-form-container");
  formContainer.classList.remove("editing-form-container");
  //scroll
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  scrollToBottom();
};

socket.on("edit-msg", ({ text, id, time }) => {
  let isRepliedMsg = false;
  // console.log(text);
  if (
    document
      .getElementById(id)
      .querySelector(".text")
      .querySelector(".replied-msg") != undefined ||
    document
      .getElementById(id)
      .querySelector(".text")
      .querySelector(".replied-msg") != null
  ) {
    isRepliedMsg = true;
    document
      .getElementById(id)
      .querySelector(".text")
      .querySelector(".replied-msg")
      .remove();
  }
  //get msg div with id
  const msgDiv = document.getElementById(id);
  //get text msg div
  const textDiv = msgDiv.querySelector(".text");
  console.log(textDiv.outerHTML);
  let eText = document.createElement('p');
  eText.innerHTML = text.substring(3,text.length - 5) 
  //insert new text
  if (!isRepliedMsg) {
    //normal msg directly edited to division
    if (text.length <= 57) {
      textDiv.innerHTML = text;
    } else {
      // var lgMsg = eText.innerText;
      // var longMsg = lgMsg.substring(0,lgMsg.length-5);
      var seenMsg = eText.innerText.substring(0,49);
      // var extraMsg = eText.innerText.substring(49,);
      textDiv.innerHTML = `<p><span class='seen' id='s${cntr}'>
      ${seenMsg}</span><span class='extra' id='${cntr}xtra'>${text.substring(3,text.length - 5)}</span><br>
      <span id='${cntr}link' style='color: blue; cursor :pointer;' onclick='readMore(${cntr});'>Read more</span></p>`
      ++cntr;
    }
  } else {
    //replied msg
    //alter the para and add to div
    var editpara = document.createElement('p');
    var tempPara = document.createElement('p');
    if (text.length <= 57) {
      editpara.innerHTML = text.substring(3,text.length-5); 
    } else {
      tempPara.innerHTML = text.substring(3,text.length-5);
      // var longMsg = lgMsg.substring(3,lgMsg.length-5);
      var seenMsg = tempPara.innerText.substring(0,49);
      // var extraMsg = longMsg.substring(49,);
      // console.log(textDiv.outerHTML);
      editpara.innerHTML = `<span class="seen" id='s${cntr}'>
      ${seenMsg}</span><span class="extra" id="${cntr}xtra">${tempPara.innerHTML}</span><br>
      <span id="${cntr}link" style="color: blue; cursor :pointer;" onclick="readMore(${cntr});">Read more</span></p>`
      ++cntr; 
    }
    editpara.classList.add('replied-msg');
    textDiv.appendChild(editpara);
  }

  //change time
  const timeSpan = msgDiv.querySelector(".meta").querySelector("span");
  timeSpan.innerHTML = moment(time).format("h:mm a");
  //close menu
  msgDiv.querySelector(".btn-container").classList.add("hide");
  //change classes
  msgDiv.classList.add("edited-msg");
  let allList = document.querySelectorAll(".btn-container");
  allList.forEach((item) => {
    // item.style['display'] = 'none';
    item.classList.add("hide");
  });
});

/* Replying msg feature */
var isReplying = { status: false, info: { name: "", text: "" } };
var repliedDiv;
const replyMsg = (id) => {
  let isRepliedMsg = false;
  if (
    document
      .getElementById(id)
      .querySelector(".text")
      .querySelector(".replied-msg") != undefined ||
    document
      .getElementById(id)
      .querySelector(".text")
      .querySelector(".replied-msg") != null
  ) {
    isRepliedMsg = true;
  }
  //find author name and text
  repliedDiv = document.getElementById(id);
  const authorDetails = repliedDiv.querySelector(".meta");
  const authorName = authorDetails.innerText;
  let msgText;
  if (isRepliedMsg) {
    msgText = repliedDiv.querySelector(".text").querySelector(".replied-msg");
  } else {
    msgText = repliedDiv.querySelector(".text").querySelector("p");
  }
  //set replying mode
  isReplying = {
    status: true,
    info: { name: authorDetails.outerHTML, text: msgText.outerHTML },
  };
  //set popup
  const formContainer = document.querySelector(".chat-form-container");
  formContainer.classList.add("replying-form-container");
  document
    .querySelector(".replying-form-container")
    .setAttribute("to", `Replying to : ${authorName.split(" ")[0]}`);
  //create close button
  let span = document.createElement("span");
  span.classList.add("material-icons", "replying-close-btn");
  span.innerText = "cancel";
  span.setAttribute("onclick", "cancelReply()");
  //prepend
  formContainer.prepend(span);

  const inputEle = document.getElementById("msg");
  inputEle.focus();
};

const emitReplyMsg = (e) => {
  //get msg text
  const repMsg = e.target.elements.msg.value;
  //check msg and emit
  let isRepliedMsg = false;
  if (
    repliedDiv
      .querySelector(".text")
      .querySelector(".replied-msg") != undefined ||
    repliedDiv
      .querySelector(".text")
      .querySelector(".replied-msg") != null
  ) {
    isRepliedMsg = true;
  }
  var rplyText;
  var rplyPara = repliedDiv
    .querySelector(".text")
    .querySelector(`${isRepliedMsg ? ".replied-msg" : "p"}`);
    if(rplyPara.innerText.length <=50) {
      rplyText = rplyPara.outerHTML;
    } else {
      var temp = rplyPara.querySelector('.seen').innerText;
      rplyText = '<p>' + temp + '...</p>';
    }

  let userID = socket.id;
  if (repMsg.trim() == "") {
    isReplying = { status: false, info: { name: "", text: "" } };
  } else {
    const msg = `<div class="replied-msg-container">${isReplying.info.name}${rplyText}</div><p class='replied-msg'>${repMsg}</p>`;
    socket.emit("chatMessage", { msg, userID });
    isReplying = { status: false, info: { name: "", text: "" } };
  }
  //remove popup
  const formContainer = document.querySelector(".chat-form-container");
  formContainer.classList.remove("replying-form-container");
  //remove close btn
  formContainer.querySelector(".replying-close-btn").remove();
  // //scroll
  let allList = document.querySelectorAll(".btn-container");
  allList.forEach((item) => {
    // item.style['display'] = 'none';
    item.classList.add("hide");
  });
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  scrollToBottom();
};

const cancelReply = () => {
  //exit replying
  isReplying = { status: false, info: { name: "", text: "" } };
  //remove popup
  const formContainer = document.querySelector(".chat-form-container");
  formContainer.classList.remove("replying-form-container");
  //remove close btn
  formContainer.querySelector(".replying-close-btn").remove();
  // //scroll
  formContainer.querySelector("#msg").focus();
  scrollToBottom();
};

const cancelEdit = () => {
  //exit replying
  isEditing = { status: false, id: null };
  //remove popup
  const formContainer = document.querySelector(".chat-form-container");
  formContainer.classList.remove("editing-form-container");
  //remove close btn
  formContainer.querySelector(".replying-close-btn").remove();
  // //scroll
  //remove popup
  let allList = document.querySelectorAll(".btn-container");
  allList.forEach((item) => {
    // item.style['display'] = 'none';
    item.classList.add("hide");
  });
  formContainer.querySelector("#msg").focus();
  scrollToBottom();
};

var isMenuOpen = false;
const menuOpen = (id) => {
  let allList = document.querySelectorAll(".btn-container");
  allList.forEach((item) => {
    // item.style['display'] = 'none';
    item.classList.add("hide");
  });

  const msgDiv = document.getElementById(id);
  const btnContainer = msgDiv.querySelector(".btn-container");
  if (!isMenuOpen) {
    isMenuOpen = true;
    // btnContainer.style['display'] = 'flex';
    btnContainer.classList.remove("hide");
  } else {
    isMenuOpen = false;
    // btnContainer.style['display'] = 'none';
    btnContainer.classList.add("hide");
  }
};

isSideBarOpen = false;
const toggleSideBar = () => {
  if (isSideBarOpen) {
    document.querySelector(".chat-sidebar").classList.remove("sidemenu-open");
    document.querySelector(".hamburger").classList.remove("is-active");
    isSideBarOpen = false;
  } else {
    document.querySelector(".chat-sidebar").classList.add("sidemenu-open");
    document.querySelector(".hamburger").classList.add("is-active");
    isSideBarOpen = true;
  }
};

//image upload
const imageUpload = async () => {
  const file = document.getElementById('image-input').files[0];
  const formData = new FormData()
  formData.append('image', file)
  console.log(formData)
  const res = await fetch('/image', {
    method: 'post', 
    body: formData
  })
  const imgURL = await res.json();
  document.getElementById('msg').value = `![img](${imgURL.link})`
  document.getElementById('image-input').value = '';
}
