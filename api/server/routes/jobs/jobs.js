/**
 *
 * labor resource routing
 *
 */

'use strict';

const Config = require('./jobs.config');

module.exports = (server, options) => [
    {
        method: 'POST',
        path: '/jobs',
        config: Config.create
    },
    {
        method: 'PUT',
        path: '/jobs/{id}',
        config: Config.update
    },
    {
        method: 'DELETE',
        path: '/jobs/{id}',
        config: Config.delete
    },
    {
        method: 'GET',
        path: '/jobs',
        config: Config.get
    },
    {
        method: 'GET',
        path: '/jobs/search',
        config: Config.search
    },
    {
        method: 'GET',
        path: '/jobs/{id}',
        config: Config.detail
    },
    {
        method: 'POST',
        path: '/jobs/relay/job',
        config: Config.relay
    },
    {
        method: "GET",
        path: '/jobs/active/{id}',
        config: Config.active
    }
];
