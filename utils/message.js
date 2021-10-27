const marked = require("marked");
const encode = require("html-entities")["encode"];
const moment = require("moment");
var Filter = require('bad-words')
const filter = new Filter({ placeHolder: 'x'});

function sanitize(message){
    const fiterMessage = filter.clean(message)
    const markdown = marked(fiterMessage)
    const reducedString = markdown.replace( /(<([^>]+)>)/ig, '')
    if(filter.isProfane(reducedString)){
        return null
    }
    return fiterMessage
}

function formatMessages(id, username, text, userID, profilePhoto='') {
    if(text.includes('replied-msg-container')){
    return {
        id,
        username,
        text: sanitize(text) || "Profanity not allowed",
        userID,
        time: moment().valueOf(),
        profilePhoto,
    };
}
return {
    id,
    username,
    text: sanitize(encode(text)) || "Profanity not allowed",
    userID,
    time: moment().valueOf(),
    profilePhoto,
};

}
module.exports = formatMessages;
