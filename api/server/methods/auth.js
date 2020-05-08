'use strict';

const Chalk = require('chalk');
const Boom = require('boom');
const _ = require('lodash');
const Token = require('../models/token');
const { sendOTP } = require('../sms');
const User = require('../models/user');
const VerifyPhoneCode = require('../models/verification-phone-code');
var ObjectId = require('mongodb').ObjectId;

module.exports = (server, options) => [
    {
        name: 'auth.refreshToken',
        method: refreshToken
    },
    {
        name: 'auth.resetPassword',
        method: resetPassword
    },
    {
        name: 'auth.setPassword',
        method: setPassword
    }
];

const refreshToken = async (refresh_token, h) => {
    const registeredToken = await Token.findOne({
        // token: request.headers['Authorization'],
        refresh_token,
        expired_at: {
            $gt: new Date().valueOf()
        }
    })

    if (!registeredToken) {
        throw Boom.notFound('This refresh token is not valid or expired.');
    }

    return registeredToken;
};



const resetPassword = async (request, h) => {
    // check if any user got this phone or not
    const phone = request.query.phone;
    const user = await User.findByPhone( phone );
    
    if (!user) {
        throw Boom.notFound(`Can't find an activate user with phone ${phone}`);
    }

    await sendOTP({ phone, ip: request.info.remoteAddress });
    
    return {
        msg: 'Check your phone for further instruction !'
    };
};


const setPassword = async (payload, h) => {
    const verificationCode = await VerifyPhoneCode.findByPhone(payload.phone)

    if (!verificationCode) {
        throw Boom.notFound('Try to resend the code again !!');
    }

    if (verificationCode.code != payload.verify_code) {
        throw Boom.notFound('Verify code is not correct');
    }

    VerifyPhoneCode.deleteOne({ ...verificationCode });

    const password = await User.generatePasswordHash(payload.password);
    const update = {
        $set: {
            password: password.hash
        }
    };
    const user = await User.findOneAndUpdate({
        phone: payload.phone
    }, update);

    if (!user) {
        throw Boom.notFound('User not found.');
    }
    return {
        msg: 'Sucessfull change the password, try to login!!'
    };
};
