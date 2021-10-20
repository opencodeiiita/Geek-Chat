const marked = require("marked");
const encode = require("html-entities")["encode"];
const moment = require("moment");
function formatMessages(id, username, text, userID) {
    if (text.includes('replied-msg-container')) {
        return {
            id,
            username,
            text: marked(text),
            userID,
            time: moment().valueOf(),
        };
    }
    return {
        id,
        username,
        text: marked(encode(text)),
        userID,
        time: moment().valueOf(),
    };
}
module.exports = formatMessages;
