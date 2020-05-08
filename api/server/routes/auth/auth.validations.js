'use strict';

const Joi = require('joi');

module.exports = {
    login: {

        payload: {
            email: Joi.string().min(3).required(),
            password: Joi.string().min(8).max(60).required()
        }
    },
    list: {
        query: {
            sort: Joi.string().default('_id'),
            limit: Joi.number().default(20),
            page: Joi.number().default(1)
        }
    },
    detail: {
        params: {
            id: Joi.string().length(24).required()
        }
    },
    create: {
            payload: {
                name: Joi.string().required(),
                email: Joi.string().email({ minDomainAtoms: 2 }).required(),
                password: Joi.string().min(8).max(60).required(),
                roles: Joi.string().default('editor')
            }
    },
    update: {
        params: {
            id: Joi.string().length(24).required()
        },
        payload: {
            name: Joi.string().required(),
            email: Joi.string().email({ minDomainAtoms: 2 }).required(),
            password: Joi.string().min(8).max(60),
            roles: Joi.string().default('editor')
        }
    },
    delete: {
        params: {
            id: Joi.string().length(24).required()
        }
    }

};
