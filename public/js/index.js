const socket = io();
const roomName = document.querySelector('#room-name');
const users = document.querySelector('#users');
const roomNameDiv = document.querySelector('.room-name-container');
const userMap = new Map();
var room;
socket.on('roomJoined', (connectionObj) => {
  console.log(connectionObj);
  room = connectionObj.room;
  roomName.innerHTML = connectionObj.room;
  roomNameDiv.classList.remove('animate');
});
socket.on("message", (message) => {
  outputMessage(message);
});

function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
  scrollToBottom();
}

const form = document.getElementById("chat-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  scrollToBottom();
});

function scrollToBottom() {
  document.querySelector(".chat-messages").scrollTop =
    document.querySelector(".chat-messages").scrollHeight;
}
// document.ready(() => {
//   var toggleButton = document.getElementById("toggle");
//   toggleButton.onclick = function () {
//     toggleButton.classList.toggle("active");
//   };
// });

socket.on("userList", (userList) => {
  for (let { name, session_id } of userList) {
    userMap.set(session_id, name);
    let user = document.createElement('li');
    user.classList.add('fade-in');
    user.dataset.id = session_id;
    user.innerHTML = name;
    users.appendChild(user);
  }
});
socket.on("userJoined", ({ id, username }) => {
  userMap.set(id, username);
  const user = document.createElement('li');
  user.classList.add('fade-in');
  user.dataset.id = id;
  user.innerHTML = username;
  users.appendChild(user);
});

socket.on('userLeft', ({ id, username }) => {
  const user = document.querySelector(`[data-id="${id}"]`);
  if (user)
    user.classList.add('fade-out');
  setTimeout(() => { user.remove(); }, 1500);
  userMap.delete(id, username);
});