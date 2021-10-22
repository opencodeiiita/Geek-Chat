var usersArr = [];
function newUser(name, room, session_id, profilePhoto) {
    return usersArr.push({
        name,
        room,
        session_id,
        profilePhoto
    });
}

module.exports = { usersArr, newUser };
