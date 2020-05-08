'use strict';

const Joi = require('joi');
const Config = require('../../runtime/companies');

module.exports = {
    find: {
        query: {
            name: Joi.string().default(''),
            sort: Joi.string().default('_id'),
            limit: Joi.number().default(20),
            page: Joi.number().default(1)
        }
    },

    findOne: {
        query: {
        },
        params: {
            id: Joi.string().required().description('the id to get the company')
        }
    },

    create: {
        query: {
        },
        payload: {
            name: Joi.string().required(),
            global_name: Joi.string().default(''),
            address: Joi.string().required(),
            phone: Joi.string().required(),
            email: Joi.string().email().lowercase().allow(''),
            avatar: Joi.string().default(''),
        }
    },

    edit: {
        query: {
        },
        params: {
            id: Joi.string()
        },
        payload: {
            isActive: Joi.boolean().required(),
            name: Joi.string().required(),
            global_name: Joi.string().default(''),
            address: Joi.string().required(),
            phone: Joi.string().required(),
            email: Joi.string().email().lowercase().allow(''),
            avatar: Joi.string().default(''),
        }
    },

    destroy: {
        query: {
        },
        params: {
            id: Joi.string().required()
        }
    }
};
