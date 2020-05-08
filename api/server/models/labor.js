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

const LaborSchema = new Schema({
        name: {type: String},
        from: {type: String},
        social: {
            fb: {type: String},
            zalo: {type: String},
        },
        id_number: {type: String},
    id_image: Object,
        dob: {type: Date},
    job_save: [{type: Schema.Types.ObjectId, ref: 'jobs'}]
});

LaborSchema.plugin(mongoosePaginate);
LaborSchema.index({name: 1});
LaborSchema.index({id_number: 1}, {unique: true});
LaborSchema.statics.generatePasswordHash = async function (password) {

    Assert.ok(password, 'Missing password argument.');

    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(password, salt);

    return {password, hash};
}

module.exports = mongoose.model('labors', LaborSchema);

