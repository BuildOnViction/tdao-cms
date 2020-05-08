'use strict';

const Validations = require('./jobTypes.validations');
const Handlers = require('./jobTypes.handlers');

module.exports = {
    get: {
        tags: ['api', 'jobTypes'],
        description: 'Get list jobTypes',
        notes: 'Get list jobTypes',
        cors: {
            origin: ['*']
        },
        auth: false,
        pre: [
            {method: (request, h) => request.server.methods.jobTypes.getList(request, h), assign: 'jobTypes'},
        ],
        handler: Handlers.getList,
        plugins: {
            policies: ['httpResponse']
        }
    }
};
