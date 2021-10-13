const socket = io('/roomMembers');
socket.on('roomMembersCount', (roomMembersCount) => {
    for (let room in roomMembersCount) {
        const roomOption = document.querySelector(`option[value="${room}"]`);
        roomOption.innerHTML = `${room} (${roomMembersCount[room]})`;
    }
});
socket.on('countUpdate', ({ room, count }) => {
    const roomOption = document.querySelector(`option[value="${room}"]`);
    roomOption.innerHTML = `${room} (${count})`;
});

