'use strict';

module.exports = {
    find: (request, h) => request.pre.contracts,
    findOne: (request, h) => request.pre.contract,
    create: (request, h) => request.pre.contract,
    edit: (request, h) => request.pre.contract,
    destroy: (request, h) => h.response({}).code(204)
};
