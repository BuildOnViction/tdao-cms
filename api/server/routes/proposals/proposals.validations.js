'use strict';

const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);

module.exports = {
    getList: {
        query: {
            limit: Joi.number().default(50),
            page: Joi.number().default(1)
        },
    },
    getOne: {
        params: {
            id: Joi.string().description('the id to get the proposal')
        },
    },
    approve: {
        params: {
            id: Joi.string().description('the id to get the proposal')
        },
        query: {
            quorum: Joi.number().default(50),
        }
    },
    reject: {
        params: {
            id: Joi.string().description('the id to get the proposal')
        },
        payload: {
            reason: Joi.string().length(1000),
        }
    },
};
