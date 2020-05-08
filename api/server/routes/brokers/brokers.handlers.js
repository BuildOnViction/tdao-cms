'use strict';

module.exports = {
    create: (request, h) => request.pre.brokers,
    list: (request, h) => request.pre.brokers,
    delete: (request, h) => request.pre.brokers,
    detail: (request, h) => request.pre.brokers,
    listJob: (request, h) => request.pre.brokers,
    edit: (request, h) => request.pre.brokers,
    detailByBroker: (request, h) => request.pre.brokers,
    listJobPaginate: (request, h) => request.pre.brokers
};
