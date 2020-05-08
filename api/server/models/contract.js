'use strict';
const Assert = require('assert');
const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const NewDate = require('joistick/new-date');
const MongoModels = require('mongo-models');
const slugify = require('slugify');

const schema = Joi.object({
    _id: Joi.object(),
    title: Joi.string(),
    slug: Joi.string(),
    company: Joi.string().allow(null),
    country: Joi.string(),
    working_location: Joi.string(),
    professions: Joi.array().items(Joi.object({
        id: Joi.string(),
        name: Joi.string()
    })).default([]),
    salary_range: Joi.object({
        from: Joi.number(),
        to: Joi.number(),
    }),
    require_experience: Joi.boolean(),
    cv_location: Joi.string(),
    submission_deadline: Joi.string(),
    content: Joi.string(),
    required_condition: Joi.string(),
    benefit: Joi.string(),
    broker_id: Joi.string(),
    timeCreated: Joi.date().default(NewDate(), 'time of creation'),
}).unknown(true);

class Contract extends MongoModels {
    static async create(contractPayload) {
        contractPayload.slug = slugify(contractPayload.title);
        const document = new this(contractPayload);
        const contracts = await this.insertOne(document);
        return contracts[0];
    }
}

Contract.collectionName = 'contracts';
Contract.schema = schema;
Contract.indexes = [
    { key: { country: 1 } },
    { key: { company: 1, country: 1 } },
    { key: { broker_id: 1} }
];

module.exports = Contract;
