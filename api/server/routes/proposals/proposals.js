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
        method: 'PUT',
        path: '/proposals/approve/{id}',
        config: Config.approve
    }
];
