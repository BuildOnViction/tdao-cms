/**
 *
 * labor resource routing
 *
 */

'use strict';

const Config = require('./addresses.config');

module.exports = (server, options) => [
    {
        method: 'GET',
        path: '/addresses',
        config: Config.get
    },
    {
        method: 'GET',
        path: '/addresses/scan-balance',
        config: Config.scanBalance
    },
    {
        method: 'GET',
        path: '/addresses/transfer-balance',
        config: Config.transferBalance
    },
];
