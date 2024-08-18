const moment = require("moment");

let config = require('../env/config')

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

function getCurrentTime() {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
}


module.exports = {
    sleep,
    getCurrentTime,
}
