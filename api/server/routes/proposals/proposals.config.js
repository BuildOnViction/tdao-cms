'use strict';

const Validations = require('./proposals.validations');
const Handlers = require('./proposals.handlers');

module.exports = {
    get: {
        tags: ['api', 'proposals'],
        description: 'Get list proposals',
        notes: 'Get list proposals',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin','editor'],
        },
        pre: [
            {method: (request, h) => request.server.methods.proposals.getList(request, h), assign: 'proposals'},
        ],
        validate: Validations.getList,
        handler: Handlers.getList,
        plugins: {
            policies: ['httpResponse']
        }
    },
    getOne: {
        tags: ['api', 'proposals'],
        description: 'Get one proposal',
        notes: 'Get one proposal',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin','editor'],
        },
        pre: [
            {method: (request, h) => request.server.methods.proposals.getOne(request, h), assign: 'proposal'},
        ],
        validate: Validations.getOne,
        handler: Handlers.getOne,
        plugins: {
            policies: ['httpResponse']
        }
    },
    approve: {
        tags: ['api', 'proposals'],
        description: 'Approve a proposal',
        notes: 'Approve a proposal',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin','editor'],
        },
        pre: [
            {method: (request, h) => request.server.methods.proposals.approve(request, h), assign: 'output'},
        ],
        validate: Validations.approve,
        handler: Handlers.approve,
        plugins: {
            policies: ['httpResponse']
        }
    },
    reject: {
        tags: ['api', 'proposals'],
        description: 'reject a proposal',
        notes: 'reject a proposal',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin','editor'],
        },
        pre: [
            {method: (request, h) => request.server.methods.proposals.reject(request, h), assign: 'output'},
        ],
        validate: Validations.reject,
        handler: Handlers.reject,
        plugins: {
            policies: ['httpResponse']
        }
    }
};
