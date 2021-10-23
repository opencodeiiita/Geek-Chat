const marked = require("marked");
const encode = require("html-entities")["encode"];
const moment = require("moment");
function formatMessages(id, username, text, userID, profilePhoto='') {
    if(text.includes('replied-msg-container')){
    return {
        id,
        username,
        text: marked(text),
        userID,
        time: moment().valueOf(),
        profilePhoto,
    };
}
return {
    id,
    username,
    text: marked(encode(text)),
    userID,
    time: moment().valueOf(),
    profilePhoto,
};

}
module.exports = formatMessages;
