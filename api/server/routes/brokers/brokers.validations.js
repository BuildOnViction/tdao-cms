'use strict';

const Config = require('../../runtime/brokers');
const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
module.exports = {
    create:{
        payload: {
            name: Joi.string().min(5).lowercase().required(),
            email: Joi.string().lowercase().email({minDomainAtoms: 2}).allow('').allow(null),
            password: Joi.string().min(6).required(),
            phone: Joi.string().regex(/^([0-9])\d{9,11}$/).required(),
            introduce: Joi.string().allow(null).allow(''),
            dob: Joi.date().format('DD-MM-YYYY').allow(null).allow(''),
            company: Joi.object({
                id: Joi.string().length(24).allow(null).allow(''),
                name: Joi.string().allow(null).allow('')
            }),
            avatar: Joi.object({
                public_id: Joi.string().regex(/([a-z0-9]){20}/g).required(),
                version: Joi.number().required(),
                signature: Joi.string().required(),
                resource_type: Joi.string().required(),
                created_at: Joi.date().required(),
                bytes: Joi.number(),
                type: Joi.string(),
                tags: Joi.array(),
                etag: Joi.string().regex(/([a-z0-9]){32}/g).required(),
                placeholder: Joi.boolean(),
                url: Joi.string().regex(/http:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).required(),
                secure_url: Joi.string().regex(/https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).required(),
                original_filename: Joi.string().required()
            }).allow({}),
            owner: Joi.boolean().default(true)
        }
    },
    edit:{
        params: {
            id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        },
        payload: {
            name: Joi.string().min(5).lowercase().required(),
            email: Joi.string().lowercase().email({minDomainAtoms: 2}).allow('').allow(null),
            password: Joi.string().min(6),
            phone: Joi.string().regex(/^([0-9])\d{9,11}$/).required(),
            introduce: Joi.string().allow(null).allow(''),
            dob: Joi.date().format('DD-MM-YYYY').allow(null).allow(''),
            company: Joi.object({
                id: Joi.string().length(24).allow(null).allow(''),
                name: Joi.string().allow(null).allow('')
            }),
            avatar: Joi.object({
                public_id: Joi.string().regex(/([a-z0-9]){20}/g).required(),
                version: Joi.number().required(),
                signature: Joi.string().required(),
                resource_type: Joi.string().required(),
                created_at: Joi.date().required(),
                bytes: Joi.number(),
                type: Joi.string(),
                tags: Joi.array(),
                etag: Joi.string().regex(/([a-z0-9]){32}/g).required(),
                placeholder: Joi.boolean(),
                url: Joi.string().regex(/http:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).required(),
                secure_url: Joi.string().regex(/https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).required(),
                original_filename: Joi.string().required()
            }).allow({}),
            owner: Joi.boolean().default(true)
        }
    },
    delete: {
        params: {
            id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        },
    },
    detail: {
        params: {
            id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        },
    },
    detailByBroker: {
        params: {
            id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        },
    },
    listJob: {
        params: {
            broker_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        },
    },
    listJobPaginate: {
        query: {
            limit: Joi.number().default(10),
            page: Joi.number().default(1)
        },
    }
}
