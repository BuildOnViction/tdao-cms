'use strict';

const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);

module.exports = {
    getList: {
        query: {
            from_address: Joi.string().allow(null).allow(''),
            hash: Joi.string().allow(null).allow(''),
            coin_type: Joi.string().allow(null).allow('').uppercase(),
            limit: Joi.number().default(50),
            page: Joi.number().default(1)
        },
    },
};
