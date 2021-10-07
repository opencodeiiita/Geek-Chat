const username = document.querySelector('#exampleFormControlInput1');
const roomSelector = document.querySelector('#exampleFormControlSelect1');
const joinChatFrom = document.querySelector('#joinChatForm');

const lastUsedUserName = localStorage.getItem('last_used_username');
const lastJoinedRoom = localStorage.getItem('last_joined_room');
if (lastUsedUserName !== null)
    username.value = lastUsedUserName;
if (lastJoinedRoom !== null)
    roomSelector.value = lastJoinedRoom;

joinChatFrom.addEventListener('submit', () => {
    localStorage.setItem('last_used_username', username.value);
    localStorage.setItem('last_joined_room', roomSelector.value);
});