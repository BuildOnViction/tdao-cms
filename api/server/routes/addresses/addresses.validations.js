'use strict';

const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const Images = require('../../runtime/image-validation');
module.exports = {
    getList: {
        query: {
            address: Joi.string().allow(null).allow(''),
            coin: Joi.string().default("ALL"),
            limit: Joi.number().default(50),
            page: Joi.number().default(1)
        },
    },
    detail: {
        query: {
            from_node: Joi.string().required(),
        },
        params: {
            id: Joi.string().required(),
        },
    },
};
