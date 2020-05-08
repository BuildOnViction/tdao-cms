'use strict';
const Assert = require('assert');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Slug = require('slug');
const Crypto = require('crypto');
const NewDate = require('joistick/new-date');


const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    user_id: {type: Object},
    token: {type: String},
    user_agent: {type: String},
    refresh_token: {type: String},
    expired_at: {type: Date, default: NewDate()},
});

TokenSchema.plugin(mongoosePaginate);
TokenSchema.index({user_id: 1});
TokenSchema.statics.createData = async function create(payload) {

    const tokens = await this.findOneAndUpdate({
        user_id: payload.user_id
    }, payload, {
        upsert: true
    });

    return tokens[0];
}

TokenSchema.statics.generateRefreshToken = function (userId) {
    const timestamp = (new Date()).valueOf();
    const md5 = Crypto.createHash('md5');
    md5.update(userId + '_' + timestamp);
    return md5.digest('hex');
};

module.exports = mongoose.model('tokens', TokenSchema);
