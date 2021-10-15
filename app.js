const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors"); //make requests from one website to another website in the browser

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const compileSass = require('compile-sass');

var usrnm;
var room;

const formatMessages = require("./utils/message.js");
const {
  usersArr,
  newUser
} = require("./utils/users.js");
const {
  roomMembersCount
} = require("./utils/roomMembersCount.js");
const {
  on
} = require("events");

// Json
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use('/css/:cssName', compileSass.setup({
  sassFilePath: path.join(__dirname, 'public/scss/'),
  sassFileExt: 'scss',
  embedSrcMapInProd: true,
  resolveTildes: true,
  nodeSassOptions: {
    errLogToConsole: true,
    noCache: true,
    force: true
  }
}));

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.get("/", (req, res) => {
  // rendering main.html
  res.sendFile(__dirname + "/public/main.html");
});

app.post("/", (req, res) => {
  usrnm = req.body.usrnm;
  room = req.body.room;

  if (
    usersArr.find((user) => {
      if (user.name === usrnm && user.room === room) return true;
    })
  ) {
    return res.sendFile(__dirname + "/public/index.html");
  }

  res.sendFile(__dirname + "/public/main.html");
});
const roomDetails = io.of('/roomMembers');
roomDetails.on('connection', (socket) => {
  roomDetails.emit('roomMembersCount', roomMembersCount);
})
io.on("connection", (socket) => {
  //Validating user
  //Connecting the user to the room
  //Greeting message in the room user has joined

  if (usrnm != undefined && room != undefined) {
    roomMembersCount[room]++;
    roomDetails.emit('countUpdate', {
      room,
      count: roomMembersCount[room]
    });
    newUser(usrnm, room, socket.id);
    socket.join(room);
    socket.emit("roomJoined", {
      room,
      username: usrnm
    });
  }

  socket.emit(
    "message",
    formatMessages("", "GeekChat Bot", "Welcome to GeekChat!", "", [])
  );
  socket
    .to(room)
    .emit(
      "message",
      formatMessages("", "GeekChat Bot", `${usrnm} entered the chat!`, "", [])
    );
  let userList = usersArr.filter((ob) => ob.room === room);
  socket.emit("userList", userList);

  socket.to(room).emit("userJoined", {
    id: socket.id,
    username: usrnm
  });

  //When a user leaves the room
  //Disconnecting the user from the room
  //Message in the room user has disconnected
  socket.on("disconnect", () => {
    roomMembersCount[room]--;
    roomDetails.emit('countUpdate', {
      room,
      count: roomMembersCount[room]
    });
    io.in(room).emit("userLeft", {
      id: socket.id,
      username: usrnm
    });
    let userIndex = -1,
      user;
    for (const [index, userObj] of usersArr.entries()) {
      if (userObj.session_id === socket.id) {
        userIndex = index;
        user = userObj;
        break;
      }
    }
    if (userIndex !== -1) {
      usersArr.splice(userIndex, 1);
      io.in(user.room).emit(
        "message",
        formatMessages("", "GeekChat Bot", `${user.name} disconnected.`, "", [])
      );
    }
  });

  socket.on("chatMessage", (messageObject) => {
    // When a user sends a chat message
    // An id is created for the message
    // Validating user and sending the message in the room
    let user = usersArr.find((ob) => ob.session_id === socket.id);

    let messageID = user.name + "_" + new Date().getTime();
    if (user) {
      io.in(user.room).emit(
        "message",
        formatMessages(
          messageID,
          user.name,
          messageObject.msg,
          messageObject.userID,
          messageObject.arr 
        )
      );
    }
  });
  socket.on("deleteChatMsg", (msgId) => {
    // When a user deletes a message
    // Message id is verified
    // Message is deleted
    if (msgId == null || msgId == undefined) {
      return;
    }
    let user = usersArr.find((ob) => ob.session_id === socket.id);
    if (user) {
      io.in(user.room).emit("deleteMsgFromChat", msgId);
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));