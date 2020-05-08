'use strict';

module.exports = {
    find: (request, h) => request.pre.user,
    findOne: (request, h) => request.pre.user,
    disable: (request, h) => request.pre.user,
    create: (request, h) => request.pre.user,
    edit: (request, h) => request.pre.user,
    destroy: (request, h) => request.pre.user,
    userStatistics: (request, h) => request.pre.user
};
