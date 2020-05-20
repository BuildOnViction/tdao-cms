const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const MongoModels = require('mongo-models');
const NewDate = require('joistick/new-date');
const Boom = require('boom');


const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
        name: String,
        slug: String,
    },
    {
        timestamps: {
            createdAt: 'timeCreated'
        }
    }
);

transactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('transactions', transactionSchema);

