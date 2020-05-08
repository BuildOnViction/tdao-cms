'use strict';
const Assert = require('assert');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Slug = require('slug');


const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const VerificationPhoneCodeSchema = new Schema({
        phone: {type: String},
        code: {type: Number},
        ip: {type: String},
        message: {type: Object},
        expired_in: {type: Number},
    }
);

VerificationPhoneCodeSchema.plugin(mongoosePaginate);
VerificationPhoneCodeSchema.index({phone: 1});
VerificationPhoneCodeSchema.statics.createData = async function ({phone, code, ip, message, expired_in}) {

    Assert.ok(phone, 'Missing phone argument.');
    Assert.ok(code, 'Missing code argument.');
    Assert.ok(ip, 'Missing ip argument.');

    const phonecode = await this.findOneAndUpdate({
        phone: phone
    }, {
        code,
        phone,
        expired_in,
        ip,
        // message
    }, {
        upsert: true
    });
    return phonecode;
}

VerificationPhoneCodeSchema.statics.findByPhone = async function (phone) {
        Assert.ok(phone, 'Missing phone argument.');
        const currentDate = new Date().valueOf();
        const query = {
            phone,
            expired_in: {
                $gte: currentDate
            }
        };

        return this.findOne(query);
    }

module.exports = mongoose.model('verification-phone-codes', VerificationPhoneCodeSchema);
