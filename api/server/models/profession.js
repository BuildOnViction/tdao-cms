'use strict';
const Assert = require('assert');
const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const NewDate = require('joistick/new-date');
const MongoModels = require('mongo-models');

const schema = Joi.object({
    _id: Joi.object(),
    name: Joi.string(),
    introduction: Joi.string().allow(null).allow(''),
    timeCreated: Joi.date().default(NewDate(), 'time of creation'),
}).unknown(true);

class Profession extends MongoModels {
    static async create(professionsPayload) {
        const document = new this(professionsPayload);
        const professions = await this.insertOne(document);
        return professions[0];
    }
}

Profession.collectionName = 'professions';
Profession.schema = schema;
Profession.indexes = [
    { key: { name: 1 }, unique: 1 }
];

module.exports = Profession;
