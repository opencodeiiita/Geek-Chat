const socket = io();
socket.on("message",message=>{
    outputMessage(message);
    
});

function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

const form=document.getElementById("chat-form");
form.addEventListener("submit",e=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit("chatMessage",msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

})
