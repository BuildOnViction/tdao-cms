'use strict';

const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const Images = require('../../runtime/image-validation');
module.exports = {
    getList: {
        query: {
            address: Joi.string().allow(null).allow(''),
            coin: Joi.string().allow(null).allow('').default(""),
            limit: Joi.number().default(50),
            page: Joi.number().default(1)
        },
    },
    scanBalance: {
        query: {
            coin: Joi.string().required(),
        }
    },
    transferBalance: {
        query: {
            address: Joi.string().required(),
            coin: Joi.string().required(),
        },
    },
};
