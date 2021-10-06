const path = require("path");
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
var usrnm;
var room;

const formatMessages = require("./utils/message.js");
const {
    usersArr,
    newUser
} = require("./utils/users.js");
const {
    on
} = require("events");
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/main.html");
});

app.post("/", (req, res) => {
    usrnm = req.body.usrnm;
    room = req.body.room;

    res.sendFile(__dirname + "/public/main.html");
});

io.on('connection', socket => {
    if (usrnm != undefined && room != undefined) {
        newUser(usrnm, room, socket.id);
    }

    socket.emit("message", formatMessages("GeekChat Bot", "Welcome to GeekChat!"));
    socket.broadcast.emit("message", formatMessages("GeekChat Bot", `A User entered the chat!`));

    socket.on("disconnect", () => {
        let user = usersArr.find(ob => ob.session_id === socket.id);
        io.emit("message", formatMessages("GeekChat Bot", `${user.name} disconnected.`));
    });

    socket.on("chatMessage", (msg) => {
        let user = usersArr.find(ob => ob.session_id === socket.id);
        console.log(usersArr);
        io.emit("message", formatMessages(user.name, msg));
    });
});


const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
