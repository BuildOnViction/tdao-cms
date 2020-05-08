'use strict';

const Config = require('./auth.config');

module.exports = (server, options) => [
    {
        method: 'POST',
        path: '/login',
        config: Config.login
    },
    {
        method: 'GET',
        path: '/admins',
        config: Config.list
    },
    {
        method: 'GET',
        path: '/admins/{id}',
        config: Config.detail
    },
    {
        method: 'POST',
        path: '/admins',
        config: Config.create
    },
    {
        method: 'PUT',
        path: '/admins/{id}',
        config: Config.update
    },
    {
        method: 'DELETE',
        path: '/admins/{id}',
        config: Config.delete
    }
];
