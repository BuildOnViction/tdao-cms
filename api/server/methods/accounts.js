'use strict';

const Boom = require('boom');

module.exports = (server, options) => [
    {
        name: 'pages.find',
        method: find,
        options: {
            //   cache: server.plugins.runtime.cache.pages.find.cache ? server.plugins.runtime.cache.pages.find : undefined,
            generateKey: (opts) => JSON.stringify(opts)
        }
    },
];

const find = async function (request, h) {

    return { message: 'Success.' };
};
