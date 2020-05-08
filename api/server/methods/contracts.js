'use strict';

const Chalk = require('chalk');
const Boom = require('boom');
const _ = require('lodash');
const Contract = require('../models/contract');
var ObjectId = require('mongodb').ObjectId;

module.exports = (server, options) => [
    {
        name: 'contracts.create',
        method: create
    },
    {
        name: 'contracts.edit',
        method: edit
    },
    {
        name: 'contracts.destroy',
        method: destroy
    },
    {
        name: 'contracts.findBrokerContracts',
        method: findBrokerContracts
    }
];

const create = async (payload, h) => {
    return await Contract.update(payload);
};

const edit = async (id, payload) => {
    const updateContract = {
        $set: payload
    };
   
    const contract = await Contract.findByIdAndUpdate(id, updateContract);

    if (!contract) {
        throw Boom.notFound('Contract not found.');
    }

    return contract;
};

const findBrokerContracts = async (payload, h) => {
    const query = {
        broker_id: payload.broker_id
    };
    const limit = payload.limit;
    const page = payload.page;
    const options = {
        sort: Contract.sortAdapter(payload.sort)
    };

    return await Contract.pagedFind(query, page, limit, options);
}

const destroy = async function (id, h) {
    const contract = await Contract.findByIdAndDelete(id);

    if (!contract) {
        throw Boom.notFound('Contract not found.');
    }

    return { message: 'Success.' };
}