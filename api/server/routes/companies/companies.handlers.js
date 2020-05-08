'use strict';

module.exports = {
    find: (request, h) => request.pre.companies,
    findOne: (request, h) => request.pre.company,
    create: (request, h) => request.pre.company,
    edit: (request, h) => request.pre.company,
    destroy: (request, h) => h.response({}).code(204)
};
