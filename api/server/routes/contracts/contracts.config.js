'use strict';

const Validations = require('./contracts.validations');
const Handlers = require('./contracts.handlers');
const AuthServices = require('../../auth/auth.services');

module.exports = {
    find: {
        validate: Validations.find,
        tags: ['api', 'contracts'],
        description: 'Get a paginated list of all contracts. [Root Scope]',
        notes: 'Get a paginated list of all contracts.',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.contracts.find(request, h), assign: 'contracts' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.find,
        plugins: {
            policies: ['httpResponse']
        }
    },

    findOne: {
        validate: Validations.findOne,
        tags: ['api', 'contracts'],
        description: 'Get a contract by ID. [Root Scope]',
        notes: 'Get a contract by ID.',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: 'contracts.findOne(params.id)', assign: 'contract' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.findOne,
        plugins: {
            policies: ['httpResponse']
        }
    },

    create: {
        validate: Validations.create,
        tags: ['api', 'contracts'],
        description: 'Create a new contract. [Root Scope]',
        notes: 'Create a new contract. This does not map this contract to an account.',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.contracts.contractnameCheck(payload)(request.payload, h), assign: 'pages' },
            { method: (request, h) => request.server.methods.contracts.emailCheck(payload)(request.payload, h), assign: 'emailCheck' },
            { method: (request, h) => request.server.methods.contracts.create(payload)(request.payload, h), assign: 'contract' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.create,
        plugins: {
            policies: ['httpResponse']
        }
    },

    edit: {
        validate: Validations.edit,
        tags: ['api', 'contracts'],
        description: 'Update a contract by ID. [Root Scope]',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        notes: 'Update a contract by ID.',
        pre: [
            { method: 'contracts.contractnameCheck(payload)', assign: 'contractnameCheck' },
            { method: 'contracts.emailCheck(payload)', assign: 'emailCheck' },
            { method: 'contracts.edit(params.id, payload)', assign: 'contract' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.edit,
        plugins: {
            policies: ['httpResponse']
        }
    },

    destroy: {
        tags: ['api', 'contracts'],
        description: 'Delete a contract by ID. [Root Scope]',
        notes: 'Delete a contract by ID.',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        validate: Validations.destroy,
        pre: [
            { method: 'contracts.destroy(params.id)', assign: 'contract' }
        ],
        handler: Handlers.destroy,
        plugins: {
            policies: ['httpResponse']
        }
    }
};
