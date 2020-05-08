'use strict';
const Assert = require('assert');
const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const Schema = mongoose.Schema;

const CompanySchema = new Schema({
        global_name: String,
        name: String,
        ceo: String,
        isActive: Boolean,
        avatar: String,
        address: String,
        website: String,
        phone: String,
        email: String,
        business_licence: String,
        business_licence_issue_at: Date,
        introduction: String,
    },
    {
        strict: false,
        timestamps: {
            createdAt: 'timeCreated'
        }
    }
);


CompanySchema.plugin(mongoosePaginate);

CompanySchema.index( { name: 1 }, {unique: 1 });
CompanySchema.index( { global_name: 1 }, {unique: 1 });
CompanySchema.index( { phone: 1 }, {unique: 1 });

module.exports = mongoose.model('companies', CompanySchema);

