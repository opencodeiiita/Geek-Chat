const socket = io();
const roomName = document.querySelector("#room-name");
const users = document.querySelector("#users");
const roomNameDiv = document.querySelector(".room-name-container");
const userMap = new Map();
const CURRENT_USER = sessionStorage.getItem("current_user");
var room;
var c = 0,
  d,
  present_target = "0",
  dusername,
  tempid;
var initialcolor;
socket.on("roomJoined", (connectionObj) => {
  room = connectionObj.room;
  roomName.innerHTML = connectionObj.room;
  roomNameDiv.classList.remove("animate");
});
socket.on("message", (message) => {
  let userID = socket.id;
  outputMessage({ message, userID });
});

function outputMessage(msg) {
  var values = Object.values(msg);
  const [a, b] = [...values];
  const div = document.createElement("div");
  div.setAttribute("id", values[0].id);
  var pid = `${values[0].id}-p`;
  if (values[0].userID === values[1]) {
    div.classList.add("author");
    div.innerHTML += `<button class="btn-danger" onclick="deleteMsg('${values[0].id}')"><span class="material-icons">
        delete
        </span></button>`;
    var temp1 = `icon-reply icon-2x replyicon ${values[0].id} 55`;
    div.innerHTML += ` <button class="discard"  ><i class='${temp1}'></i></button> `;
  } else {
    div.classList.add("message");
    var temp1 = `icon-reply icon-2x replyicon ${values[0].id} 55`;
    div.innerHTML += ` <button class="discard" ><i class='${temp1}'></i></button> `;
  }
  if (values[0].username === "GeekChat Bot") {
    div.classList.add("bot");
    div.classList.add("inactive");
    div.innerHTML += `<p class="meta">${values[0].username} <span>${moment(
      values[0].time
    ).format("h:mm a")}</span></p>
        <p class="text">
        ${values[0]["text"]}
        </p>`;
  } else {
    let textid = `${pid}-text`;
    let textcontent = values[0].text.slice(3, -5);
    let replyContent = "";
    if (a.replyarr.length > 0) {

      var str =
        a.replyarr[0].slice(0, 250) +
        (a.replyarr[0].length > 250 ? "....." : "");
        replyContent= `<div class=" ${a.replyarr[2]} reply-div  "><p class="${a.replyarr[2]} replyPh">${a.replyarr[1]}</p> <hr>
                    <p class="${a.replyarr[2]} nouseclass">${str}</p></div>`;

      if (document.querySelector(".replyBox")) {
        document.querySelector(".replyBox").remove();
        document.getElementById(tempid).style.backgroundColor = initialcolor;
        present_target = "0";
      }
    }
    div.innerHTML += `<p class='meta' id='${pid}'>${
      values[0].username
    } <span>${moment(values[0].time).format("h:mm a")}</span></p>
       ${replyContent}
      <p class='text textpadding' id = '${textid}'>
      ${textcontent}
      </p>`;
  }
  document.querySelector(".chat-messages").appendChild(div);
  scrollToBottom();
}

const form = document.getElementById("chat-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let arr = [];
  if (present_target !== "0") arr = [d.trim(), dusername, tempid];
  const msg = e.target.elements.msg.value;
  let userID = socket.id;
  socket.emit("chatMessage", { msg, userID, arr });

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
$(document).on("click", ".discard", (e) => {
  var target = e.target;
  var temp = target.classList;
  present_target = temp[3];
  tempid = temp[3];
  const author = document.querySelectorAll(".author");
  const bot = document.querySelectorAll(".message");
  d = document.getElementById(`${temp[3]}-p-text`).textContent;
  dusername = temp[3].split("_")[0];
  for (let i = 0; i < author.length; i++) {
    if (i < bot.length) bot[i].style.backgroundColor = "#e5e5ea";
    author[i].style.backgroundColor = "#0b93f6";
  }
  for (let i = 0; i < bot.length; i++) {
    bot[i].style.backgroundColor = "#e5e5ea";
    if (i < author.length) author[i].style.backgroundColor = "#0b93f6";
  }
  initialcolor = document.getElementById(temp[3]).style.backgroundColor;
  document.getElementById(temp[3]).style.backgroundColor = "#7664c9";
  const replyBox = document.querySelectorAll(".replyBox");
  for (let i = 0; i < replyBox.length; i++) {
    replyBox[i].remove();
  }
  const div = document.createElement("div");
  div.setAttribute("class", "replyBox");
  var arr;
  arr = [];
  arr = document.getElementById(`${temp[3]}-p`).textContent.split(" ");
  div.innerHTML = "";
  div.innerHTML = `<p>Replying to  <b>${arr[0]}</b> </p> <span class="cross"> &#10006;</span>`;
  document.querySelector(".chat-main").appendChild(div);
  if (document.querySelector(".replyBox")) {
    document.querySelector(".cross").addEventListener("click", () => {
      document.querySelector(".replyBox").remove();
      document.getElementById(temp[3]).style.backgroundColor = initialcolor;
      present_target = "0";
    });
  }
});

$(document).on("click", ".reply-div", (e) => {
  var target = e.target;
  var temp2 = target.classList;
  var c = temp2[0];
  document.getElementById(c).scrollIntoView({ behavior: "smooth" });
});
$(document).on("click", ".replyPh", (e) => {
  var target = e.target;
  var temp2 = target.classList;
  var c = temp2[0];
  document.getElementById(c).scrollIntoView({ behavior: "smooth" });
});

$(document).on("click", ".nouseclass", (e) => {
  var target = e.target;
  var temp2 = target.classList;
  var c = temp2[0];
  document.getElementById(c).scrollIntoView({ behavior: "smooth" });
});
