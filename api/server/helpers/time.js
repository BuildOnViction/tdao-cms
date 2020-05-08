function getUTCTimestamp() {
    const timeZoneOffset = (new Date()).getTimezoneOffset(); // offset are in minutes ex 7h -> 420 min
    
    return new Date().valueOf() + timeZoneOffset*60*1000;
}

exports.getUTCTimestamp = getUTCTimestamp;