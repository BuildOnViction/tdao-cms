'use strict';
const preResponse = function (request, h) {
    if (request.path.indexOf('/api') !== 0) {
        return h.continue;
    }

    if (request.response.statusCode && request.response.statusCode < 400) {
        request.response.source = {
            error: false,
            data: request.response.source
        };
    }
    else {
        request.response.source = {
            error: true,
            message: request.response.source
        };
    }
    return h.continue;
};

const register = (server, options) => {
    server.ext('onPreResponse', preResponse);
};

module.exports = {
    name: 'http-policy-plugin',
    register
};