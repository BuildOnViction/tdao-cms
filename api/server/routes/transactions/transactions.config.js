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
        auth: false,
        pre: [
            {method: (request, h) => request.server.methods.transactions.getList(request, h), assign: 'transactions'},
        ],
        handler: Handlers.getList,
        plugins: {
            policies: ['httpResponse']
        }
    }
};
