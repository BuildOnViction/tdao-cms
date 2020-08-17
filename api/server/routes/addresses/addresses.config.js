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
    scanBalance: {
        tags: ['api', 'addresses'],
        description: 'Scan balance',
        notes: 'Scan balance',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
        },
        validate: Validations.scanBalance,
        pre: [
            {method: (request, h) => request.server.methods.addresses.scanBalance(request, h), assign: 'data'},
        ],
        handler: Handlers.scanBalance,
        plugins: {
            policies: ['httpResponse']
        }
    },
    transferBalance: {
        tags: ['api', 'addresses'],
        description: 'Scan balance',
        notes: 'Scan balance',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
        },
        validate: Validations.transferBalance,
        pre: [
            {method: (request, h) => request.server.methods.addresses.transferBalance(request, h), assign: 'data'},
        ],
        handler: Handlers.transferBalance,
        plugins: {
            policies: ['httpResponse']
        }
    },
};
