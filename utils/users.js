const { CreateUser } = require('../models/user');

var usersArr = [];
var currentUserData = { usrnm: null, room: null, profilePhoto: null };

function newUser(name, room, session_id, profilePhoto) {
    return usersArr.push(CreateUser(name, room, session_id, profilePhoto));
}

module.exports = { usersArr, newUser, currentUserData };
