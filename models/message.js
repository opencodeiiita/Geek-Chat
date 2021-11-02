const moment = require("moment");
const {sanitizeAndRenderMessage} = require("../utils/message")
function formatMessage(id, username, text, userID, profilePhoto="") {
    return {
        id,
        username,
        text: sanitizeAndRenderMessage(text, !text.includes("replied-msg-container")),
        userID,
        time: moment().valueOf(),
        profilePhoto,
    };
}

module.exports = {
    formatMessage
};
