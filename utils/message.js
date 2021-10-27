const marked = require("marked");
const encode = require("html-entities")["encode"];
const moment = require("moment");
var Filter = require('bad-words')
const filter = new Filter({ placeHolder: 'x'});

function formatMessages(id, username, text, userID, profilePhoto='') {
    if(text.includes('replied-msg-container')){
    return {
        id,
        username,
        text: filter.clean(marked(text).toString().replace( /(<([^>]+)>)/ig, '')),
        userID,
        time: moment().valueOf(),
        profilePhoto,
    };
}
return {
    id,
    username,
    text: filter.clean(marked(encode(text)).toString().replace( /(<([^>]+)>)/ig, '')),
    userID,
    time: moment().valueOf(),
    profilePhoto,
};

}
module.exports = formatMessages;
