'use strict';

const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const Images = require('../../runtime/image-validation');
module.exports = {
    create: {
        payload: Joi.object({
            data:Joi.string().required(),
        }).unknown(true)
    },
    getList: {
        query: {
            task_id: Joi.string().allow(null).allow(''),
            keywords: Joi.string().allow(null).allow(''),
            from_node: Joi.valid('wallet', 'master', 'verifier', 'proxy', 'api').allow('').default('').description('allow wallet master verifier proxy api '),
            status: Joi.string().allow(null).allow(''),
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
    relay: {
        payload: Joi.object({}).unknown(true)
    },
};
