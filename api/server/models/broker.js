'use strict';
const Assert = require('assert');
const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const NewDate = require('joistick/new-date');
const MongoModels = require('mongo-models');


const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const Schema = mongoose.Schema;

const BrokerSchema = new Schema({
        name: {type: String},
        dob: {type: Date},
        introduce: {type: String},
        company: {
            id: {type: String},
            name: {type: String}
        },
        balance: {type: Number},

    },
    {
        timestamps: {
            createdAt: 'timeCreated'
        }
    }
);


BrokerSchema.plugin(mongoosePaginate);

BrokerSchema.index({name: 1, 'company.name': 1, 'company.id': 1});
BrokerSchema.statics.findByCompany = async function (by, search) {
    const query = {
        company: {}
    };
    query.company[by] = search;

    return await this.find(query);
}

BrokerSchema.statics.findByEmail = async function (email) {

    Assert.ok(email, 'Missing email argument.');

    const query = {email: email.toLowerCase()};

    return this.findOne(query);
}

module.exports = mongoose.model('brokers', BrokerSchema);