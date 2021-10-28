const encode = require("html-entities")["encode"];
const marked = require("marked");
const moment = require("moment");
const Filter = require("bad-words");

const filter = new Filter({ placeHolder: "x" });
const profanityWarning = marked("**Message blocked**: profanity not allowed!");

function sanitizeAndRenderMessage(message, encodeMessage) {
    if (encodeMessage)
        message = encode(message);

    const fiterMessage = filter.clean(message);
    const markdown = marked(fiterMessage);
    const reducedString = markdown.replace( /(<([^>]+)>)/ig, "");

    if (filter.isProfane(reducedString))
        return profanityWarning;

    return markdown;
}

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
    formatMessage,
    sanitizeAndRenderMessage
};
