/**
 *
 * labor resource routing
 *
 */

'use strict';

const Config = require('./jobTypes.config');

module.exports = (server, options) => [
    {
        method: 'GET',
        path: '/jobTypes',
        config: Config.get
    }
];
