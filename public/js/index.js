const socket = io();
const roomName = document.querySelector("#room-name");
const users = document.querySelector("#users");
const roomNameDiv = document.querySelector(".room-name-container");
const userMap = new Map();
const CURRENT_USER = sessionStorage.getItem("current_user");
var room;
socket.on("roomJoined", (connectionObj) => {
  room = connectionObj.room;
  roomName.innerHTML = connectionObj.room;
  roomNameDiv.classList.remove("animate");
});
socket.on("message", (message) => {
  if (document.querySelector('.typing') != null || document.querySelector('.typing') != undefined) {
      document.querySelector('.typing').remove();
      TYPING_USERS = []
  }
  let userID = socket.id;
  outputMessage({ message, userID });
});

function outputMessage(msg) {
  var values = Object.values(msg);
  const div = document.createElement("div");
  div.setAttribute("id", values[0].id);
  if (values[0].userID === values[1]) {
    div.classList.add("author");
    div.innerHTML += `<div class="btn-container hide"><button class="btn-danger2" onclick="deleteMsg('${values[0].id}')"><span class="material-icons">
        delete
        </span></button>
        <button class="btn-danger2 btn-danger-edit" onclick="editMsg('${values[0].id}')"><span class="material-icons">
        edit
        </span></button></div>`;
    playSound('send')
  } else {
    div.classList.add("message");
    if (values[0].username === "GeekChat Bot") {
      playSound('bot')
    } else {
      playSound('recieve')
    }
  }
  if (values[0].username === "GeekChat Bot") {
    div.classList.add("bot");
    div.innerHTML += `<p class="meta">${values[0].username} <span>${moment(
      values[0].time
    ).format("h:mm a")}</span></p>
        <div class="text">
        ${values[0]["text"]}
        </div>`;
    playSound('bot')
  } else {
    div.innerHTML += `
    <button class="btn-danger btn-danger-reply" onclick="replyMsg('${values[0].id}')"><span class="material-icons">
        reply
    </span></button>
    <p class="meta">${values[0].username} <span>${moment(
      values[0].time
    ).format("h:mm a")}</span></p>
        <div class="text">
        ${values[0].text}
        </div>
        ${values[0].userID === values[1] ? `<span class="material-icons three-dots-menu" onclick="menuOpen('${values[0].id}')">
        more_vert
        </span>` : ``}`;
  }


  let repliedMsgCheck = div.querySelector('.text').querySelector('.replied-msg-container')
  if (repliedMsgCheck != null || repliedMsgCheck != undefined) {
    if (repliedMsgCheck.querySelector('.replied-msg') != null || repliedMsgCheck.querySelector('.replied-msg') != undefined) {
      repliedMsgCheck.querySelector('.replied-msg').classList.remove('replied-msg');
    }
  }

  document.querySelector(".chat-messages").appendChild(div);
  scrollToBottom();
}

const form = document.getElementById("chat-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let allList = document.querySelectorAll('.btn-container');
  allList.forEach(item => {
      // item.style['display'] = 'none';
      item.classList.add('hide');
  })

  if (isEditing.status) {
    return emitEditedText(e);
  }
  if (isReplying.status) {
    return emitReplyMsg(e);
  }

  const msg = e.target.elements.msg.value;
  let userID = socket.id;
  if (msg.trim() == "") { }
  else {
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
  for (let { name, session_id } of userList) {
    userMap.set(session_id, name);
    let user = document.createElement("li");
    user.classList.add("fade-in");
    user.dataset.id = session_id;
    user.innerHTML = name;
    users.appendChild(user);
  }
});
socket.on("userJoined", ({ id, username }) => {
  userMap.set(id, username);
  const user = document.createElement("li");
  user.classList.add("fade-in");
  user.dataset.id = id;
  user.innerHTML = username;
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
});

function deleteMsg(info) {
  let [name, id] = info.split("_");
  if (name === CURRENT_USER) {
    socket.emit("deleteChatMsg", info);
  }
}

const beep1 = document.getElementById('beep1')
const beep2 = document.getElementById('beep2')
const beep3 = document.getElementById('beep3')
const playSound = (beep) => {
  if (beep === 'send') {
    return beep1.play();
  }
  if (beep === 'bot'){
    return beep3.play();
  }
  return beep2.play();
}

//timeout for removing typing element from dom
var timeout;

//event for typing
socket.on('typing', (typingUser)=>{
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
    if (document.querySelector('.typing') != null || document.querySelector('.typing') != undefined) {
      timeout = setTimeout(() => {
        document.querySelector('.typing').remove();
        TYPING_USERS = []
      }, 3000);
    }
})

//list of typing users
var TYPING_USERS = [];

const emitTyping = () => {
  socket.emit('typing', {name: CURRENT_USER, room});
}

//function to append typing msg
const appendTyping = () => {

  //checking for existing typing element
  if (document.querySelector('.typing') != null || document.querySelector('.typing') != undefined) {
    let divEx = document.querySelector('.typing')

    //if found then changing its content
    if (TYPING_USERS.length > 2) {
      divEx.innerHTML = `<p class="typing-text">many people typing <span class="dot-animation"></span></p>`;
    } else if (TYPING_USERS.length > 1) {
      divEx.innerHTML = `<p class="typing-text">${TYPING_USERS.join(', ')} are typing <span class="dot-animation"></span></p>`;
    } else if (TYPING_USERS.length <= 1) {
      divEx.innerHTML = `<p class="typing-text">${TYPING_USERS.join(', ')} is typing <span class="dot-animation"></span></p>`;
    }

    return;
  }

  //create div
  let div = document.createElement('div');

  //add class
  div.classList.add("message", "typing");

  //check no. of users typing
  if (TYPING_USERS.length > 2) {
    div.innerHTML = `<p class="typing-text">many people typing <span class="dot-animation"></span></p>`;
  } else if (TYPING_USERS.length > 1) {
    div.innerHTML = `<p class="typing-text">${TYPING_USERS.join(', ')} are typing <span class="dot-animation"></span></p>`;
  } else if (TYPING_USERS.length <= 1) {
    div.innerHTML = `<p class="typing-text">${TYPING_USERS.join(', ')} is typing <span class="dot-animation"></span></p>`;
  }

  //apend element to dom
  document.querySelector(".chat-messages").appendChild(div);
  scrollToBottom();
}

/* EDITING MSG FEATURE */
var isEditing = {status: false, id: null};

const editMsg = (id) => {
  //set editing mode to true
  isEditing = {status: true, id: id};
  let isRepliedMsg = false;
  //get old text
  if (document.getElementById(id).querySelector('.text').querySelector('.replied-msg') != undefined || document.getElementById(id).querySelector('.text').querySelector('.replied-msg') != null) {
    isRepliedMsg = true;
  }
  const prevMsgText = document.getElementById(id).querySelector('.text').querySelector(`${isRepliedMsg ? '.replied-msg' : 'p'}`).innerText;
  //select input and put old text in input
  const inputEle = document.getElementById('msg');
  inputEle.value = prevMsgText;
  //set popup to inform user that he is editing
  const formContainer = document.querySelector('.chat-form-container');
  formContainer.classList.add('editing-form-container');
  //close btn
  let span = document.createElement('span');
  span.classList.add('material-icons', 'replying-close-btn');
  span.innerText = 'cancel';
  span.setAttribute('onclick', 'cancelEdit()');
  //prepend
  formContainer.prepend(span);
  //focus
  inputEle.focus();
}

const emitEditedText = (e) => {
  //get msg text
  const msg = e.target.elements.msg.value;
  //check msg and emit
  if (msg.trim() == "") {
    isEditing = {status: false, id: null};
  }
  else {
    socket.emit("edited-msg", { text: msg, id: isEditing.id });
    isEditing = {status: false, id: null};
  }
  //remove popup
  const formContainer = document.querySelector('.chat-form-container');
  formContainer.classList.remove('editing-form-container');
  //scroll
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  scrollToBottom();
}

socket.on('edit-msg', ({text, id, time}) => {
  let isRepliedMsg = false;
  if (document.getElementById(id).querySelector('.text').querySelector('.replied-msg') != undefined || document.getElementById(id).querySelector('.text').querySelector('.replied-msg') != null) {
    isRepliedMsg = true;
    document.getElementById(id).querySelector('.text').querySelector('.replied-msg').remove();
  }
  //get msg div with id
  const msgDiv = document.getElementById(id);
  //get text msg div
  const textDiv = msgDiv.querySelector('.text');
  //insert new text
  if (isRepliedMsg) {
    textDiv.innerHTML += `<p class='replied-msg'>${text}</p>`
  } else {
    textDiv.innerHTML = `<p class='text'>${text}</p>`
  }
  //change time
  const timeSpan = msgDiv.querySelector('.meta').querySelector('span');
  timeSpan.innerHTML = moment(time).format("h:mm a");
  //close menu
  msgDiv.querySelector('.btn-container').classList.add('hide');
  //change classes
  msgDiv.classList.add('edited-msg');
  let allList = document.querySelectorAll('.btn-container');
  allList.forEach(item => {
    // item.style['display'] = 'none';
    item.classList.add('hide');
  })
})

/* Replying msg feature */
var isReplying = {status: false, info: {name: "", text: ""}}

const replyMsg = (id) => {
  let isRepliedMsg = false;
  if (document.getElementById(id).querySelector('.text').querySelector('.replied-msg') != undefined || document.getElementById(id).querySelector('.text').querySelector('.replied-msg') != null) {
    isRepliedMsg = true;
  }
  //find author name and text
  const msgDiv = document.getElementById(id);
  const authorDetails = msgDiv.querySelector('.meta');
  const authorName = authorDetails.innerText;
  let msgText;
  if (isRepliedMsg) {
    msgText = msgDiv.querySelector('.text').querySelector('.replied-msg');
  } else {
    msgText = msgDiv.querySelector('.text').querySelector('p');
  }
  //set replying mode
  isReplying = {status: true, info: {name: authorDetails.outerHTML, text: msgText.outerHTML}}
  //set popup
  const formContainer = document.querySelector('.chat-form-container');
  formContainer.classList.add('replying-form-container');
  document.querySelector('.replying-form-container').setAttribute('to', `Replying to : ${authorName.split(' ')[0]}`)
  //create close button
  let span = document.createElement('span');
  span.classList.add('material-icons', 'replying-close-btn');
  span.innerText = 'cancel';
  span.setAttribute('onclick', 'cancelReply()');
  //prepend
  formContainer.prepend(span);

  const inputEle = document.getElementById('msg');
  inputEle.focus();
}

const emitReplyMsg = (e) => {
  //get msg text
  const repMsg = e.target.elements.msg.value;
  //check msg and emit
  let userID = socket.id;
  if (repMsg.trim() == "") {
    isReplying = {status: false, info: {name: "", text: ""}};
  }
  else {
    const msg = `<div class="replied-msg-container">${isReplying.info.name}${isReplying.info.text}</div><p class='replied-msg'>${repMsg}</p>`
    socket.emit("chatMessage", { msg, userID });
    isReplying = {status: false, info: {name: "", text: ""}};
  }
  //remove popup
  const formContainer = document.querySelector('.chat-form-container');
  formContainer.classList.remove('replying-form-container');
  //remove close btn
  formContainer.querySelector('.replying-close-btn').remove();
  // //scroll
  let allList = document.querySelectorAll('.btn-container');
  allList.forEach(item => {
    // item.style['display'] = 'none';
    item.classList.add('hide');
  })
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  scrollToBottom();
}

const cancelReply = () => {
  //exit replying
  isReplying = {status: false, info: {name: "", text: ""}}
    //remove popup
    const formContainer = document.querySelector('.chat-form-container');
    formContainer.classList.remove('replying-form-container');
    //remove close btn
    formContainer.querySelector('.replying-close-btn').remove();
    // //scroll
    formContainer.querySelector('#msg').focus();
    scrollToBottom();
}
const cancelEdit = () => {
    //exit replying
    isEditing = {status: false, id: null};
    //remove popup
    const formContainer = document.querySelector('.chat-form-container');
    formContainer.classList.remove('editing-form-container');
    //remove close btn
    formContainer.querySelector('.replying-close-btn').remove();
    // //scroll
    //remove popup
    let allList = document.querySelectorAll('.btn-container');
    allList.forEach(item => {
      // item.style['display'] = 'none';
      item.classList.add('hide');
    })
    formContainer.querySelector('#msg').focus();
    scrollToBottom();
}

var isMenuOpen = false;
const menuOpen = (id) => {
  let allList = document.querySelectorAll('.btn-container');
  allList.forEach(item => {
    // item.style['display'] = 'none';
    item.classList.add('hide');
  })

  const msgDiv = document.getElementById(id);
  const btnContainer = msgDiv.querySelector('.btn-container');
  if (!isMenuOpen) {
    isMenuOpen = true;
    // btnContainer.style['display'] = 'flex';
    btnContainer.classList.remove('hide')
  } else {
    isMenuOpen = false;
    // btnContainer.style['display'] = 'none';
    btnContainer.classList.add('hide');
  }
}

isSideBarOpen = false;
const toggleSideBar = () => {
  if (isSideBarOpen) {
    document.querySelector('.chat-sidebar').classList.remove('sidemenu-open');
    document.querySelector('.hamburger').classList.remove('is-active');
    isSideBarOpen = false;
  } else {
    document.querySelector('.chat-sidebar').classList.add('sidemenu-open');
    document.querySelector('.hamburger').classList.add('is-active');
    isSideBarOpen = true;
  }
}