'use strict';

const Joi = require('joi');

module.exports = {
    find: {
        query: {
            sort: Joi.string().default('_id'),
            limit: Joi.number().default(20),
            page: Joi.number().default(1)
        }
    },

    findOne: {
        query: {
        },
        params: {
            id: Joi.string().required().description('the id to get the contract')
        }
    },

    create: {
        query: {
        },
        payload: {
            contractname: Joi.string().token().lowercase().required(),
            password: Joi.string().required(),
            email: Joi.string().email().lowercase().required()
        }
    },

    edit: {
        query: {
        },
        params: {
            id: Joi.string().invalid('000000000000000000000000')
        },
        payload: {
            isActive: Joi.boolean().required(),
            contractname: Joi.string().token().lowercase().required(),
            email: Joi.string().email().lowercase().required()
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
