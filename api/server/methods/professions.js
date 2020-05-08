'use strict';

const Chalk = require('chalk');
const Boom = require('boom');
const _ = require('lodash');
const Profession = require('../models/profession');
var ObjectId = require('mongodb').ObjectId;

module.exports = (server, options) => [
    {
        name: 'professions.find',
        method: find
    }
];

const find = async (query, h) => {
    const filter = query.name ? {
        name: {
            '$regex': query.name,
            '$options': 'i'
        }
    } : {};
    const limit = query.limit;
    const page = query.page;
    const options = {
        sort: Profession.sortAdapter(query.sort)
    };

    return await Profession.pagedFind(filter, page, limit, options);
}
