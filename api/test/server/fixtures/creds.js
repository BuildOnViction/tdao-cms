'use strict';
class Credentials {
    static authHeader(username, password) {
        const combo = `${username}:${password}`;
        const combo64 = (new Buffer(combo)).toString('base64');

        return `Basic ${combo64}`;
    }
}

module.exports = Credentials;
