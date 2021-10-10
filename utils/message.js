const moment = require("moment");
function formatMessages(username,text){
    return{
        username,
        text,
        time: moment().valueOf()

    };
}
module.exports = formatMessages;