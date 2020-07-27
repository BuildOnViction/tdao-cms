'use strict';

const Validations = require('./addresses.validations');
const Handlers = require('./addresses.handlers');

module.exports = {
    get: {
        tags: ['api', 'addresses'],
        description: 'Get list addresses [Root Scope]',
        notes: 'Get list addresses',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.getList,
        pre: [
            {method: (request, h) => request.server.methods.addresses.getList(request, h), assign: 'Address'},
        ],
        handler: Handlers.getList,
        plugins: {
            policies: ['httpResponse']
        }
    },
    detail: {
        tags: ['api', 'addresses'],
        description: 'Detail addresses [Root Scope]',
        notes: 'Detail addresses',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.detail,
        pre: [
            {method: (request, h) => request.server.methods.addresses.AddressDetail(request, h), assign: 'Address'},
        ],
        handler: Handlers.detail,
        plugins: {
            policies: ['httpResponse']
        }
    },
};
