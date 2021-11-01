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
        auth: false,
        pre: [
            {method: (request, h) => request.server.methods.proposals.getList(request, h), assign: 'proposals'},
        ],
        validate: Validations.getList,
        handler: Handlers.getList,
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
        auth: false,
        pre: [
            {method: (request, h) => request.server.methods.proposals.approve(request, h), assign: 'output'},
        ],
        validate: Validations.approve,
        handler: Handlers.approve,
        plugins: {
            policies: ['httpResponse']
        }
    }
};
