'use strict';

const Chalk = require('chalk');
const Boom = require('boom');
const _ = require('lodash');
const Company = require('../models/company');
var ObjectId = require('mongodb').ObjectId;

module.exports = (server, options) => [
    {
        name: 'companies.create',
        method: create
    },
    {
        name: 'companies.edit',
        method: edit
    },
    {
        name: 'companies.destroy',
        method: destroy
    },
    {
        name: 'companies.find',
        method: find
    }
];

const create = async (payload, h) => {
    return await Company.create(payload);
};

const edit = async (id, payload) => {
    const updateCompany = {
        $set: payload
    };

    const company = await Company.findByIdAndUpdate(id, updateCompany);

    if (!company) {
        throw Boom.notFound('Company not found.');
    }

    return company;
};

const find = async (query, h) => {
    const filter = query.name ? {
        $or: [
            {
                name: {
                    '$regex': query.name,
                    '$options': 'i'
                }
            },
            {
                global_name: {
                    '$regex': query.name,
                    '$options': 'i'
                }
            }
        ]
    } : {};
    let sort = {}
    sort[query.sort] = -1;
    const options = {
        page: query.page,
        limit: query.limit,
        sort: sort
    };
    return await Company.paginate(filter,options);
}

const destroy = async function (id, h) {
    const company = await Company.findByIdAndDelete(id);

    if (!company) {
        throw Boom.notFound('Company not found.');
    }

    return { message: 'Success.' };
}