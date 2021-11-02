function CreateUser(name, room, session_id, profilePhoto){
    return {
        name,
        room,
        session_id,
        profilePhoto
    };
}

module.exports = { CreateUser };
