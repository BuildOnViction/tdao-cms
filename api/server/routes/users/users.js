/**
*
* user resource routing
*
*/

'use strict';

const Config = require('./users.config');

module.exports = (server, options) => [
    {
        method: 'GET',
        path: '/users',
        config: Config.find
    },
    {
        method: 'GET',
        path: '/users/{id}',
        config: Config.findOne
    },
    {
        method: 'DELETE',
        path: '/users/{id}',
        config: Config.destroy
    },
    {
        method: 'GET',
        path: '/users/{id}/disable',
        config: Config.disable
    },
    {
        method: 'GET',
        path: '/users/statistics',
        config: Config.userStatistics
    }
];
