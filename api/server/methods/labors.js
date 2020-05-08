const VerifyPhoneCode = require('../models/verification-phone-code');
const AuthAttempt = require('../models/auth-attempt');
const {sendOTP} = require('../sms');
const Labor = require('../models/labor');
const User = require('../models/user');
const Boom = require('boom');
const AuthConfig = require('../runtime/auth-attemp');

module.exports = (server, options) => [
    {
        name: 'labors.verify',
        method: checkPhonenumberByOTP
    },
    {
        name: 'labors.createLaborAccount',
        method: createLaborAccount
    }
];
const checkPhonenumberByOTP = async function (request, h) {
    // check if any user got this phone or not
    let phone = await Labor.findByPhone(request.payload.phone);

    if (phone) {
        throw Boom.conflict('Phone is in used');
    }
    try {
        await AuthAttempt.create({
            ip: request.remoteAddress,
            username: request.payload.phone,
            type: AuthConfig.CHECK_PHONE
        });
        return await sendOTP({...request.payload, ip: request.info.remoteAddress});
    } catch (exception) {
        throw Boom.badRequest(exception.message);
    }
}

const __verifyPhoneOTP = async (phone, verify_code) => {
    const verificationCode = await VerifyPhoneCode.findByPhone(phone);

    if (!verificationCode) {
        throw Boom.notFound('This phone has not been verified yet');
    }

    if (verificationCode.code != verify_code) {
        throw Boom.notFound('Verify code is not correct');
    }

    VerifyPhoneCode.deleteOne({...verificationCode});
}


const createLaborAccount = async function (payload, h) {
    const {email, password, phone, username, name, from, social, id_number, id_image, dob, interested_in_country, interested_in_job} = payload;

    await __verifyPhoneOTP(payload.phone, payload.verify_code)

    const labor = await Labor.create({
        name, from, social, id_number, id_image, dob, interested_in_country, interested_in_job
    });
    if (labor._id) {
        return await User.create({
            phone,
            email,
            isActive: true,
            password: password,
            username: username || phone,
            roles: {
                labor: {
                    id: labor._id.toString(),
                    name: name
                }
            }
        });
    }
    {
        throw Boom.notFound('Can\'t not found any labor');
    }

}










