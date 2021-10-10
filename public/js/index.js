// import { usersArr, newUser } from "../utils/users.js";

const socket = io();
const roomName = document.querySelector('#room-name');
const users = document.querySelector('#users');
const roomNameDiv = document.querySelector('.room-name-container');
const userMap = new Map();

var room;
socket.on('roomJoined', connectionObj => {
  console.log(connectionObj);
  room = connectionObj.room;
  roomName.innerHTML = connectionObj.room;
  roomNameDiv.classList.remove('animate');
});
socket.on('message', message => {
  let userID = socket.id;
  outputMessage({ message, userID });
  console.log({ message, userID });
});
socket.on('announcement', announcement => {
  outputAnnouncement(announcement);
});

function outputMessage(msg) {
  var values = Object.values(msg);
  console.log(msg.message);
  console.log(values[0]);
  const div = document.createElement('div');
  if (values[0].userID === values[1]) {
    div.classList.add('author');
  } else {
    div.classList.add('message');
  }
  if (values[0].username === 'GeekChat Bot') {
    div.innerHTML = `<p class="meta">${values[0].username} <span>${moment(values[0].time).format(
      'h:mm a'
    )}</span></p>
<p class="text">
${values[0]['text']}
</p>`;
  } else {
    div.innerHTML = `<p class="meta">${values[0].username} <span>${moment(values[0].time).format(
      'h:mm a'
    )}</span></p>
<p class="text">
  ${values[0].text}
</p>`;
  }

  document.querySelector('.chat-messages').appendChild(div);
  scrollToBottom();
}

function outputAnnouncement(Annc) {
  const div = document.createElement('div');
  div.setAttribute('id', 'announcement');
  div.classList.add('announcement');
  div.innerHTML = Annc.text + `<span>${moment(Annc.time).format('h:mm a')}</span>`;
  document.querySelector('.chat-messages').appendChild(div);
  scrollToBottom();
}

const form = document.getElementById('chat-form');
form.addEventListener('submit', e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  console.log(socket.id, msg);
  let userID = socket.id;
  socket.emit('chatMessage', { msg, userID });

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
  scrollToBottom();
});

function scrollToBottom() {
  document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
}
// document.ready(() => {
//   var toggleButton = document.getElementById("toggle");
//   toggleButton.onclick = function () {
//     toggleButton.classList.toggle("active");
//   };
// });

socket.on('userList', userList => {
  for (let { name, session_id } of userList) {
    userMap.set(session_id, name);
    let user = document.createElement('li');
    user.classList.add('fade-in');
    user.dataset.id = session_id;
    user.innerHTML = name;
    users.appendChild(user);
  }
});
socket.on('userJoined', ({ id, username }) => {
  userMap.set(id, username);
  const user = document.createElement('li');
  user.classList.add('fade-in');
  user.dataset.id = id;
  user.innerHTML = username;
  users.appendChild(user);
});

socket.on('userLeft', ({ id, username }) => {
  const user = document.querySelector(`[data-id="${id}"]`);
  if (user) user.classList.add('fade-out');
  setTimeout(() => {
    user.remove();
  }, 1500);
  userMap.delete(id, username);
});
