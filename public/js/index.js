const socket = io();
const roomName = document.querySelector("#room-name");
const users = document.querySelector("#users");
const roomNameDiv = document.querySelector(".room-name-container");
const userMap = new Map();
const CURRENT_USER = sessionStorage.getItem("current_user");

var room;
var c = 0,selectedmssgtext,present_target = 0,dusername,selectid;
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
  // reply message and userNAME to whiome we are going to reply is present in message object in replyarr key; 
  const [message, userID] = [...values];
  const div = document.createElement("div");
  div.setAttribute("id", values[0].id);
  var idofselectedmssg = `${values[0].id}-p`; 
  // passing usser id in class for working on event handllers
  var classNameforreplyicon = `fa fa-reply icon-reply icon-2x replyicon ${values[0].id}` 
  if (values[0].userID === values[1]) {
    div.classList.add("author");
    div.innerHTML += `<button class="btn-danger" onclick="deleteMsg('${values[0].id}')"><span class="material-icons">
        delete
        </span></button>`;
    playSound('send')
    
    
    div.innerHTML += ` <button class="replyButton"  ><i class='${classNameforreplyicon} style="font-size:24px"'></i></button> `;
  } else {
    div.classList.add("message");
    if (values[0].username === "GeekChat Bot") {
      playSound('bot')
    } else {
      playSound('recieve')
    }
    div.innerHTML += ` <button class="replyButton" ><i class='${classNameforreplyicon} style="font-size:24px"'></i></button> `;
  }
  if (values[0].username === "GeekChat Bot") {
    div.classList.add("bot");
    div.classList.add("inactivereplybutton");
    div.innerHTML += `<p class="meta">${values[0].username} <span>${moment(
      values[0].time
    ).format("h:mm a")}</span></p>
        <p class="text">
        ${values[0]["text"]}
        </p>`;
    playSound('bot')
  } else {
    //  
    let textcontent = values[0].text.slice(3, -5);
    //what content going to be replyed in going to store in replyContent
    let replyContent = "";
    if (message.replyarr.length > 0) {
      var str = message.replyarr[0].slice(0, 250) + (message.replyarr[0].length > 250 ? "....." : "");
      replyContent= `<div class=" ${message.replyarr[2]} reply-div  "><p class="${message.replyarr[2]} replyPh">${message.replyarr[1]}</p>
                    <p class="${message.replyarr[2]} nouseclass">${str}</p></div>`;

      //removing reply box 
      if (document.querySelector(".replyBox")) {
        deleteBox(`reply-${message.replyarr[2]}`, `reply-${message.replyarr[3]}`)
       
        present_target = 0;
      }
     
    }
    div.innerHTML += `<p class='meta' id='${idofselectedmssg}'>${
      values[0].username
    } <span>${moment(values[0].time).format("h:mm a")}</span></p>
       ${replyContent}
      <p class='text textpadding' id = '${idofselectedmssg}-text'>
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
  if (present_target !== 0) arr = [selectedmssgtext.trim(), dusername,  selectid, CURRENT_USER];
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

$(document).on("click", ".replyButton", (e) => {
  var target = e.target;
  var classesofReplyButton = target.classList;

  present_target++;

  //temp == classesofReplyButton.
  selectid = classesofReplyButton[5];
 
  const author = document.querySelectorAll(".author");
  const bot = document.querySelectorAll(".message");
  selectedmssgtext = document.getElementById(`${selectid}-p-text`).textContent;

  dusername = selectid.split("_")[0];
  for (let i = 0; i < author.length; i++) {
    if (i < bot.length) bot[i].classList.remove('selectcolor');
        author[i].classList.remove('selectcolor');
  }
  for (let i = 0; i < bot.length; i++) {
    bot[i].classList.remove('selectcolor')
    if (i < author.length) author[i].classList.remove('selectcolor')
  }
  document.getElementById(selectid).classList.add('selectcolor');
  // removing all previously inserted replybox from html code
  var box = `reply-${selectid} reply-${CURRENT_USER}`
  // const replyBox = document.query(".replyBox reply");
  // for (let i = 0; i < replyBox.length; i++) {
  //   replyBox[i].remove();
  // }
  //creating div for reply box;
  const div = document.createElement("div");

  div.setAttribute("class", `replyBox ${box}`);
  var arr;
  //here we are retriving username ;
  arr = document.getElementById(`${selectid}-p`).textContent.split(" ");
   //Content of reply box
  div.innerHTML = `<p>Replying to  <b>${arr[0]}</b> </p> <span class="cross ${box}"> &#10006;</span>`;
  document.querySelector(".chat-main").appendChild(div);

  // this function is for crros button function
 
});
// All these function for scroll up on clicking on replied mssg.
$(document).on("click", ".reply-div", (e) => {
  var target = e.target;
  var temp2 = target.classList;
  var c = temp2[0];
  document.getElementById(c).scrollIntoView({ behavior: "smooth",block: 'nearest', inline: 'start' });
});
$(document).on("click", ".replyPh", (e) => {
  var target = e.target;
  var temp2 = target.classList;
  var c = temp2[0];
  document.getElementById(c).scrollIntoView({ behavior: "smooth",block: 'nearest', inline: 'start' });
});

$(document).on("click", ".nouseclass", (e) => {
  var target = e.target;
  var temp2 = target.classList;
  var c = temp2[0];
  document.getElementById(c).scrollIntoView({ behavior: "smooth",block: 'nearest', inline: 'start' });
});

$(document).on('click', '.cross', (e)=>{

   deleteBox( e.target.classList[1],e.target.classList[2])
  
})

function deleteBox(info, info1){
  let name = info1.split('-')[1];
 
  if(name===CURRENT_USER)
  socket.emit('deleteReplyBox', info, info1);
 
}


socket.on("deleteBoxFromChat", (info, info1) => {
  if (info == null || info == undefined) {
    return;
  }
  const boxes = document.querySelectorAll(`.${info1}`);
  for(let i=0;i<boxes.length;i++){
    boxes[i].remove();
  }
  document.getElementById(info.split('-')[1]).classList.remove('selectcolor');
  present_target = 0;
});