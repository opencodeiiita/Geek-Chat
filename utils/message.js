const marked = require("marked");
const encode = require("html-entities")["encode"];
const moment = require("moment");
function formatMessages(id, username, text, userID, replyarr) {
    return {
        id,
        username,
        text: marked(encode(text)),
        userID,
        replyarr,
        time: moment().valueOf()
        
    };
}
module.exports = formatMessages;