'use strict';
const Assert = require('assert');
const Config = require('../config');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const NewDate = require('joistick/new-date');
const AuthConfig = require('../runtime/auth-attemp');
var moment = require('moment-timezone');
const Boom = require('boom');



const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const Schema = mongoose.Schema;

const AuthAttemptSchema = new Schema({
        ip: {type: String},
        username: {type: String},
        type: String,
    },
    {
        timestamps: {
            createdAt: 'timeCreated'
        }
    }
);


AuthAttemptSchema.plugin(mongoosePaginate);
AuthAttemptSchema.statics.abuseDetected = async function (ip, username) {
    Assert.ok(ip, 'Missing ip argument.');
    Assert.ok(username, 'Missing username argument.');

    const [countByIp, countByIpAndUser] = await Promise.all([
        this.countDocuments({ip}),
        this.countDocuments({ip, username})
    ]);
    const config = Config.authAttempts;
    const ipLimitReached = countByIp >= config.forIp;
    const ipUserLimitReached = countByIpAndUser >= config.forIpAndUser;
    let ip_in_day = await this.countDocuments({
        username,
        type: AuthConfig.CHECK_PHONE,
        timeCreated: {
            $gt: new Date(moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")),
            $lt: new Date(moment().endOf('day').format("YYYY-MM-DD HH:mm:ss"))
        }
    });
    let now = moment().valueOf();
    let date_auth;
    let minutes;
    if (parseInt(ip_in_day) >= 1) {
        date_auth = await this.findOne({
            username,
            type: AuthConfig.CHECK_PHONE,
            timeCreated: {$gt: moment().startOf('day'), $lt: moment().endOf('day')}
        }, {}, {sort: {'created_at': -1}})
        minutes = now - moment(date_auth.timeCreated).valueOf();
    }
    if (parseInt(ip_in_day) > 2 && minutes <= AuthConfig.MORE_TIME * 60 * 1000) {
            throw Boom.tooManyRequests('Your phone will recieve phone after ' + AuthConfig.MORE_TIME + ' minute')
    }
    else if (parseInt(ip_in_day) === 2 && minutes <= AuthConfig.SECOND_TIME * 60 * 1000) {
            throw Boom.tooManyRequests('Your phone will recieve phone after ' + AuthConfig.SECOND_TIME + ' minute');
    }
    else if (parseInt(ip_in_day) === 1 && minutes <= AuthConfig.FIRST_TIME * 60 * 1000) {
            throw Boom.tooManyRequests('Your phone will recieve phone after ' + AuthConfig.FIRST_TIME + ' minute')
    }


    return ipLimitReached || ipUserLimitReached;
}

AuthAttemptSchema.index({ip: 1, username: 1});

module.exports = mongoose.model('auth-attempts', AuthAttemptSchema);
