'use strict';

const Validations = require('./companies.validations');
const Handlers = require('./companies.handlers');
const AuthServices = require('../../auth/auth.services');

module.exports = {
    find: {
        validate: Validations.find,
        tags: ['api', 'companies'],
        description: 'Get a paginated list of all companies. [No Scope]',
        notes: 'Get a paginated list of all companies.',
        auth: false,
        pre: [
            { method: (request, h) => request.server.methods.companies.find(request.query, h), assign: 'companies' }
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
        tags: ['api', 'companies'],
        description: 'Get a company by ID. [Root Scope]',
        notes: 'Get a company by ID.',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: 'companies.findOne(params.id)', assign: 'company' }
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
        tags: ['api', 'companies'],
        description: 'Create a new company. [Root Scope]',
        notes: 'Create a new company. This does not map this company to an account.',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.companies.companynameCheck(payload)(request.payload, h), assign: 'pages' },
            { method: (request, h) => request.server.methods.companies.emailCheck(payload)(request.payload, h), assign: 'emailCheck' },
            { method: (request, h) => request.server.methods.companies.create(payload)(request.payload, h), assign: 'company' }
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
        tags: ['api', 'companies'],
        description: 'Update a company by ID. [Root Scope]',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        notes: 'Update a company by ID.',
        pre: [
            { method: 'companies.companynameCheck(payload)', assign: 'companynameCheck' },
            { method: 'companies.emailCheck(payload)', assign: 'emailCheck' },
            { method: 'companies.edit(params.id, payload)', assign: 'company' }
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
        tags: ['api', 'companies'],
        description: 'Delete a company by ID. [Root Scope]',
        notes: 'Delete a company by ID.',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        validate: Validations.destroy,
        pre: [
            { method: 'companies.destroy(params.id)', assign: 'company' }
        ],
        handler: Handlers.destroy,
        plugins: {
            policies: ['httpResponse']
        }
    }
};
