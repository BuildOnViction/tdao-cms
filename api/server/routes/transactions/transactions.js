/**
 *
 * labor resource routing
 *
 */

'use strict';

const Config = require('./transactions.config');

module.exports = (server, options) => [
    {
        method: 'GET',
        path: '/transactions',
        config: Config.get
    }
];
