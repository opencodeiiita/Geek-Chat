const socket = io();
const $roomName = document.querySelector('#room-name');
var room;
socket.on('roomJoined', (connectionObj) => {
  console.log(connectionObj);
  room = connectionObj.room;
  $roomName.innerHTML = connectionObj.room;
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

