'use strict';

const Validations = require('./jobs.validations');
const Handlers = require('./jobs.handlers');

module.exports = {
    create: {
        tags: ['api', 'jobs'],
        description: 'Create jobs [Root Scope]',
        notes: 'Create jobs',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.create,
        pre: [
            {method: (request, h) => request.server.methods.jobs.jobCreate(request, h), assign: 'job'},
        ],
        handler: Handlers.create,
        plugins: {
            policies: ['httpResponse']
        }
    },
    update: {
        tags: ['api', 'jobs'],
        description: 'Update jobs [Root Scope]',
        notes: 'Update jobs',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.update,
        pre: [
            {method: (request, h) => request.server.methods.jobs.jobUpdate(request, h), assign: 'job'},
        ],
        handler: Handlers.update,
        plugins: {
            policies: ['httpResponse']
        }
    },
    delete: {
        tags: ['api', 'jobs'],
        description: 'Delete jobs [Root Scope]',
        notes: 'Delete jobs',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.delete,
        pre: [
            {method: (request, h) => request.server.methods.jobs.deleteJob(request, h), assign: 'job'},
        ],
        handler: Handlers.delete,
        plugins: {
            policies: ['httpResponse']
        }
    },
    get: {
        tags: ['api', 'jobs'],
        description: 'Get list jobs [Root Scope]',
        notes: 'Get list jobs',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.getList,
        pre: [
            {method: (request, h) => request.server.methods.jobs.getList(request, h), assign: 'job'},
        ],
        handler: Handlers.getList,
        plugins: {
            policies: ['httpResponse']
        }
    },
    detail: {
        tags: ['api', 'jobs'],
        description: 'Detail jobs [Root Scope]',
        notes: 'Detail jobs',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.detail,
        pre: [
            {method: (request, h) => request.server.methods.jobs.jobDetail(request, h), assign: 'job'},
        ],
        handler: Handlers.detail,
        plugins: {
            policies: ['httpResponse']
        }
    },
    relay: {
        tags: ['api', 'jobs'],
        description: 'Detail jobs [Root Scope]',
        notes: 'Detail jobs',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.relay,
        pre: [
            {method: (request, h) => request.server.methods.jobs.relayJob(request, h), assign: 'job'},
        ],
        handler: Handlers.relay,
        plugins: {
            policies: ['httpResponse']
        }
    },
    search: {
        tags: ['api', 'jobs'],
        description: 'Search jobs [Root Scope]',
        notes: 'Search jobs',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin'],
        },
        validate: Validations.search,
        pre: [
            {method: (request, h) => request.server.methods.jobs.jobSearch(request, h), assign: 'job'},
        ],
        handler: Handlers.search,
        plugins: {
            policies: ['httpResponse']
        }
    },
    active: {
        tags: ['api', 'jobs'],
        description: 'Active jobs',
        notes: 'Active jobs',
        cors: {
            origin: ['*']
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin', 'editor'],
        },
        validate: Validations.active,
        pre: [
            {method: (request, h) => request.server.methods.jobs.activejob(request, h), assign: 'job'},
        ],
        handler: Handlers.active,
        plugins: {
            policies: ['httpResponse']
        }
    },
};
