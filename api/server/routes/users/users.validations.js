'use strict';

const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const Config = require('../../runtime/users');

module.exports = {
    find: {
        query: {
            keyword: Joi.string().allow('').allow(null),
            sort: Joi.string().default('_id'),
            limit: Joi.number().default(20),
            page: Joi.number().default(1)
        }
    },

    findOne: {
        query: {
        },
        params: {
            id: Joi.string().length(24).description('the id to get the user')
        }
    },
    disable: {
        query: {
        },
        params: {
            id: Joi.string().length(24).required().description('the id to get the user')
        }
    },

    destroy: {
        query: {},
        params: {
            id: Joi.string().length(24).required()
        }
    },
    userStatistics: {
        failAction: (request, h, err) => {

            throw err;
        },
        query: {
            start_date: Joi.date().format('DD-MM-YYYY').required(),
            end_date: Joi.date().format('DD-MM-YYYY').required()
        }
    }
};
