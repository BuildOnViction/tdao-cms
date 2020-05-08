/**
*
* broker resource routing
*
*/

'use strict';

const Config = require('./brokers.config');

module.exports = (server, options) => [
    {
        method: 'POST',
        path: '/brokers',
        config: Config.create
    },
    {
        method: 'GET',
        path: '/brokers',
        config: Config.list
    },
    {
        method: 'GET',
        path: '/brokers/paginate',
        config: Config.listJobPaginate
    },
    {
        method: 'DELETE',
        path: '/brokers/{id}',
        config: Config.delete
    },
    {
        method: 'GET',
        path: '/brokers/broker_id/{id}',
        config: Config.detailByBroker
    },
    {
        method: 'GET',
        path: '/brokers/{id}',
        config: Config.detail
    },
    {
        method: 'GET',
        path: '/brokers/{broker_id}/jobs',
        config: Config.listJob
    },
    {
        method: 'PUT',
        path: '/brokers/{id}',
        config: Config.edit
    },
];
