'use strict';

const Validations = require('./users.validations');
const Handlers = require('./users.handlers');
const AuthServices = require('../../auth/auth.services');

module.exports = {
    disable: {
        validate: Validations.disable,
        tags: ['api', 'users'],
        description: 'Disable personal. [Root Scope]',
        notes: 'Disable information',
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        pre: [
            { method: (request, h) => request.server.methods.users.disableUser(request, h), assign: 'user' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.disable,
        plugins: {
            policies: ['httpResponse']
        }
    },
    find: {
        validate: Validations.find,
        tags: ['api', 'users'],
        description: 'Get a paginated list of all users. [Root Scope]',
        notes: 'Get a paginated list of all users.',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.users.find(request, h), assign: 'user' }
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
        tags: ['api', 'users'],
        description: 'Get a user by ID. [Root Scope]',
        notes: 'Get a user by ID.',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.users.findOne(request, h), assign: 'user' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.findOne,
        plugins: {
            policies: ['httpResponse']
        }
    },


    destroy: {
        tags: ['api', 'users'],
        description: 'Delete a user by ID. [Root Scope]',
        notes: 'Delete a user by ID.',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        validate: Validations.destroy,
        pre: [
            { method: (request, h) => request.server.methods.users.destroy(request, h), assign: 'user' }
            ],
        handler: Handlers.destroy,
        plugins: {
            policies: ['httpResponse']
        }
    },
    userStatistics: {
        tags: ['api', 'users'],
        description: 'user Statistics',
        notes: 'user Statistics',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['editor', 'admin']
        },
        validate: Validations.userStatistics,
        pre: [
            {method: (request, h) => request.server.methods.users.userStatistics(request, h), assign: 'user'}
        ],
        handler: Handlers.userStatistics,
        plugins: {
            policies: ['httpResponse']
        }
    },
};
