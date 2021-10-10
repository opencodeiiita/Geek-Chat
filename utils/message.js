const marked=require("marked");
const encode=require("html-entities")['encode'];
const moment = require("moment");
function formatMessages(username,text){
    return{
        username,
        text: marked(encode(text)),
        time: moment().valueOf()
    };
}
module.exports = formatMessages;
