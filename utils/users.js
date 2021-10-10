var usersArr = [];
function newUser(name, room, session_id) {
    return usersArr.push({
        name,
        room,
        session_id,
    });
}

module.exports = { usersArr, newUser };
