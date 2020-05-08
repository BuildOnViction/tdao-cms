'use strict';
const AuthServices = require('../../auth/auth.services');

module.exports = {
    login: (request) => {
        let token = AuthServices.signToken(request, request.pre.user._id);
        return {...request.pre.user.toObject(), token: token};
    },
    list: (request) => request.pre.admin,
    detail:  (request) => request.pre.admin,
    create:  (request) => request.pre.admin,
    update: (request) => request.pre.admin,
    delete: (request) => request.pre.admin



};
