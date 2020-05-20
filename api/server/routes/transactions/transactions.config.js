'use strict';

const Validations = require('./transactions.validations');
const Handlers = require('./transactions.handlers');

module.exports = {
    get: {
        tags: ['api', 'transactions'],
        description: 'Get list transactions',
        notes: 'Get list transactions',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin','editor'],
        },
        pre: [
            {method: (request, h) => request.server.methods.transactions.getList(request, h), assign: 'transactions'},
        ],
        validate: Validations.getList,
        handler: Handlers.getList,
        plugins: {
            policies: ['httpResponse']
        }
    }
};
