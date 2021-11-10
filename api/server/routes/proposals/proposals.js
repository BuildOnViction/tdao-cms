/**
 *
 * labor resource routing
 *
 */

'use strict';

const Config = require('./proposals.config');

module.exports = (server, options) => [
    {
        method: 'GET',
        path: '/proposals',
        config: Config.get
    },
    {
        method: 'GET',
        path: '/proposals/{id}',
        config: Config.getOne
    },
    {
        method: 'PUT',
        path: '/proposals/approve/{id}',
        config: Config.approve
    },
    {
        method: 'PUT',
        path: '/proposals/reject/{id}',
        config: Config.reject
    }
];
