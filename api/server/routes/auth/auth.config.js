'use strict';

const Validations = require('./auth.validations');
const Handlers = require('./auth.handlers');

module.exports = {
    login: {
        validate: Validations.login,
        tags: ['api', 'authentication'],
        description: 'Log in with username and password. [No Scope]',
        notes: 'Log in with username and password.',
        auth: false,
        pre: [
            { method: (request, h) => request.server.methods.admins.findByCredentials(request.payload, h), assign: 'user' },
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.login,
        plugins: {
            policies: ['httpResponse']
        }
    },
    list: {
        validate: Validations.list,
        tags: ['api', 'admin'],
        description: 'list admin',
        notes: 'list admin',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.admins.listAdmin(request, h), assign: 'admin' },
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.list,
        plugins: {
            policies: ['httpResponse']
        }
    },
    detail: {
        validate: Validations.detail,
        tags: ['api', 'admin'],
        description: 'detail admin',
        notes: 'detail admin',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.admins.detailAdmin(request, h), assign: 'admin' },
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.detail,
        plugins: {
            policies: ['httpResponse']
        }
    },
    create: {
        validate: Validations.create,
        tags: ['api', 'admin'],
        description: 'create admin',
        notes: 'create admin',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.admins.addAdmin(request, h), assign: 'admin' },
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.create,
        plugins: {
            policies: ['httpResponse']
        }
    },
    update: {
        validate: Validations.update,
        tags: ['api', 'admin'],
        description: 'create admin',
        notes: 'create admin',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.admins.editAdmin(request, h), assign: 'admin' },
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.update,
        plugins: {
            policies: ['httpResponse']
        }
    },
    delete: {
        validate: Validations.delete,
        tags: ['api', 'admin'],
        description: 'delete admin',
        notes: 'delete admin',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.admins.deleteAdmin(request, h), assign: 'admin' },
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.delete,
        plugins: {
            policies: ['httpResponse']
        }
    },

};
