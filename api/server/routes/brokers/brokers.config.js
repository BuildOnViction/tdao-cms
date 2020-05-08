'use strict';

const Validations = require('./brokers.validations');
const Handlers = require('./brokers.handlers');
const AuthServices = require('../../auth/auth.services');

module.exports = {
    create: {
        validate: Validations.create,
        tags: ['api', 'brokers'],
        description: 'Create broker [Root Scope]',
        notes: 'Create broker',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.brokers.create(request.payload, h), assign: 'brokers' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.create,
        plugins: {
            policies: ['httpResponse']
        }
    },
    list: {
        tags: ['api', 'brokers'],
        description: 'List broker [Root Scope]',
        notes: 'List broker',
        auth: {
            strategy: 'jwt',
            scope: ['admin','editor']
        },
        pre: [
            { method: (request, h) => request.server.methods.brokers.list(request.payload, h), assign: 'brokers' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.list,
        plugins: {
            policies: ['httpResponse']
        }
    },
    listJobPaginate: {
        validate: Validations.listJobPaginate,
        tags: ['api', 'brokers'],
        description: 'List broker [Root Scope]',
        notes: 'List broker',
        auth: {
            strategy: 'jwt',
            scope: ['admin', 'editor']
        },
        pre: [
            {method: (request, h) => request.server.methods.brokers.listBrokerPaginage(request, h), assign: 'brokers'}
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.listJobPaginate,
        plugins: {
            policies: ['httpResponse']
        }
    },
    delete: {
        validate: Validations.delete,
        tags: ['api', 'brokers'],
        description: 'Delete broker [Root Scope]',
        notes: 'delete broker',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.brokers.delete(request, h), assign: 'brokers' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.delete,
        plugins: {
            policies: ['httpResponse']
        }
    },
    detail: {
        validate: Validations.detail,
        tags: ['api', 'brokers'],
        description: 'Detail broker [Root Scope]',
        notes: 'delete broker',
        auth: {
            strategy: 'jwt',
            scope: ['admin', 'editor']
        },
        pre: [
            { method: (request, h) => request.server.methods.brokers.detail(request, h), assign: 'brokers' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.detail,
        plugins: {
            policies: ['httpResponse']
        }
    },
    detailByBroker: {
        validate: Validations.detailByBroker,
        tags: ['api', 'brokers'],
        description: 'Detail broker [Root Scope]',
        notes: 'delete broker',
        auth: {
            strategy: 'jwt',
            scope: ['admin', 'editor']
        },
        pre: [
            {
                method: (request, h) => request.server.methods.brokers.detailBrokerByBrokerID(request, h),
                assign: 'brokers'
            }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.detailByBroker,
        plugins: {
            policies: ['httpResponse']
        }
    },
    listJob: {
        validate: Validations.listJob,
        tags: ['api', 'brokers'],
        description: 'List broker job',
        notes: 'delete broker',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.brokers.listJob(request, h), assign: 'brokers' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.listJob,
        plugins: {
            policies: ['httpResponse']
        }
    },
    edit: {
        validate: Validations.edit,
        tags: ['api', 'brokers'],
        description: 'edit broker',
        notes: 'edit broker',
        auth: {
            strategy: 'jwt',
            scope: 'admin'
        },
        pre: [
            { method: (request, h) => request.server.methods.brokers.edit(request, h), assign: 'brokers' }
        ],
        cors: {
            origin: ['*']
        },
        handler: Handlers.edit,
        plugins: {
            policies: ['httpResponse']
        }
    }
};
