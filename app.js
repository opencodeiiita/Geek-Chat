const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors"); //make requests from one website to another website in the browser
const moment = require("moment");
const fileUpload = require('express-fileupload')
const indexRoutes= require("./routes/index")
const imageRoutes= require("./routes/image")
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const compileSass = require('compile-sass');

const { sanitizeAndRenderMessage } = require("./utils/message");
const { formatMessage } = require("./models/message");

const { usersArr, newUser, currentUserData } = require("./utils/users");
const { roomMembersCount } = require("./utils/roomMembersCount");

// Json
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  "/css/:cssName",
  compileSass.setup({
    sassFilePath: path.join(__dirname, "public/scss/"),
    sassFileExt: "scss",
    embedSrcMapInProd: true,
    resolveTildes: true,
    nodeSassOptions: {
      errLogToConsole: true,
      noCache: true,
      force: true,
    },
  })
);

app.use(fileUpload())
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", indexRoutes);
app.use("/", imageRoutes);

const roomDetails = io.of("/roomMembers");
roomDetails.on("connection", (socket) => {
  roomDetails.emit("roomMembersCount", roomMembersCount);
});

io.on("connection", (socket) => {
  //Validating user
  //Connecting the user to the room
  //Greeting message in the room user has joined

  let { usrnm, room, profilePhoto } = currentUserData;

  if (usrnm != undefined && room != undefined) {
    roomMembersCount[room]++;
    roomDetails.emit("countUpdate", {
      room,
      count: roomMembersCount[room],
    });

    newUser(usrnm, room, socket.id, profilePhoto);

    socket.join(room);
    socket.emit("roomJoined", {
      room,
      username: usrnm
    });
  }

  socket.emit(
    "message",
    formatMessage("", "GeekChat Bot", "*Welcome to GeekChat!*", "")
  );

  socket
    .to(room)
    .emit(
      "message",
      formatMessage("", "GeekChat Bot", `**${usrnm}** entered the chat!`, "", profilePhoto)
    );

  let userList = usersArr.filter((ob) => ob.room === room);
  socket.emit("userList", userList);

  socket.to(room).emit("userJoined", {
    id: socket.id,
    username: usrnm,
    profilePhoto:profilePhoto
  });

  //When a user leaves the room
  //Disconnecting the user from the room
  //Message in the room user has disconnected
  socket.on("disconnect", () => {
    roomMembersCount[room]--;
    roomDetails.emit("countUpdate", {
      room,
      count: roomMembersCount[room],
    });

    io.in(room).emit("userLeft", {
      id: socket.id,
      username: usrnm,
    });

    let userIndex = -1, user;

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
        formatMessage("", "GeekChat Bot", `**${user.name}** disconnected.`, "", user.profilePhoto)
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
        formatMessage(
          messageID,
          user.name,
          messageObject.msg,
          messageObject.userID,
          user.profilePhoto,
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

  //Event listner for typing
  socket.on("typing", (info) => {
    if (info.name !== undefined || info.name !== null) {
      socket.broadcast.to(info.room).emit("typing", info.name);
    }
  });

  //event listner for edit msg
  socket.on("edited-msg", (info) => {
    //find user
    let user = usersArr.find((ob) => ob.session_id === socket.id);
    //check user
    if (user != null || user != undefined) {
      if (info.text !== undefined || info.id !== undefined) {
        info = { id: info.id, text: sanitizeAndRenderMessage(info.text, true), time: moment().valueOf() };
        io.in(user.room).emit("edit-msg", info);
      }
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
