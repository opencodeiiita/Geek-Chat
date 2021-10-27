const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors"); //make requests from one website to another website in the browser
const moment = require("moment");
const multer  = require('multer');
const fs = require('fs')
// const totalFiles = fs.readdirSync('./public/avtars').length;
let cnt = fs.readdirSync('./public/avtars').length + 1;

const storage = multer.diskStorage({
destination: function (req, file, cb) {
  cb(null, './public/avtars')
},
filename: function (req, file, cb) {
  cnt = fs.readdirSync('./public/avtars').length + 1;
  const uniqueSuffix = file.originalname.slice(file.originalname.indexOf('.'));
  cb(null, cnt + uniqueSuffix );
  
}
})

const upload = multer({ storage: storage })
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);
const compileSass = require('compile-sass');

var usrnm;
var room;
var  profilePhoto;

const formatMessages = require("./utils/message.js");
const { usersArr, newUser } = require("./utils/users.js");
const { roomMembersCount } = require("./utils/roomMembersCount.js");
const { on } = require("events");

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

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.get("/", (req, res) => {
  // rendering main.html
  res.sendFile(__dirname + "/public/main.html");
});

app.post('/newAvatar', upload.single('avatar'), function (req, res, next) {
	res.redirect('/index.html');
})

app.post("/", async(req, res) => {
  // RECAPTCHA SERVER SIDE
  if (!req.body['g-recaptcha-response'])
    return res.sendFile(__dirname + "/public/index.html");
  // Secret key
  const secretKey = '6Lc20uYcAAAAANeXi5yv3q_YTMsN3J8NTHUcpmD5';
  // Verify URL
  const query = stringify({
    secret: secretKey,
    response: req.body['g-recaptcha-response'],
    remoteip: req.connection.remoteAddress
  });
  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
  // Make a request to verifyURL
  const body = await fetch(verifyURL).then(resp => resp.json());
  // If not successful
  if (body.success !== undefined && !body.success)  return res.sendFile(__dirname + "/public/index.html");
  // If successful
  // return res.json({ success: true, msg: 'Captcha passed' });

  usrnm = req.body.usrnm;
  room = req.body.room;
  profilePhoto=req.body.imageUrl;
  if (
    usersArr.find((user) => {
      if (user.name === usrnm && user.room === room) return true;
    })
  ) {
    return res.sendFile(__dirname + "/public/index.html");
  }
  if (/\s/g.test(usrnm)) {
    return res.sendFile(__dirname + "/public/index.html");
  }

  res.sendFile(__dirname + "/public/main.html");
});


const roomDetails = io.of("/roomMembers");
roomDetails.on("connection", (socket) => {
  roomDetails.emit("roomMembersCount", roomMembersCount);
});
io.on("connection", (socket) => {
  //Validating user
  //Connecting the user to the room
  //Greeting message in the room user has joined

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
    formatMessages("", "GeekChat Bot", "Welcome to GeekChat!", "")
  );
  socket
    .to(room)
    .emit(
      "message",
      formatMessages("", "GeekChat Bot", `${usrnm} entered the chat!`, "", profilePhoto)
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
        formatMessages("", "GeekChat Bot", `${user.name} disconnected.`, "", user.profilePhoto)
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
        info = { ...info, time: moment().valueOf() };
        io.in(user.room).emit("edit-msg", info);
      }
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
