'use strict';

const Boom = require('boom');
const User = require('../models/user');
const Broker = require('../models/broker');
const Labor = require('../models/labor');
const VerifyPhoneCode = require('../models/verification-phone-code');
const AuthAttempt = require('../models/auth-attempt');
const { sendOTP } = require('../sms');
var Config = require('../config');
const AuthConfig = require('../runtime/auth-attemp');
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');

module.exports = (server, options) => [
    {
        name: 'users.find',
        method: find,
        options: {
            //   cache: server.plugins.runtime.cache.users.find.cache ? server.plugins.runtime.cache.users.find : undefined,
            generateKey: (opts) => JSON.stringify(opts)
        }
    },
    {
        name: 'users.findOne',
        method: findOne,
        options: {
            //   cache: server.plugins.runtime.cache.users.findOne.cache ? server.plugins.runtime.cache.users.findOne : undefined,
            generateKey: (opts) => JSON.stringify(opts)
        }
    },
    {
        name: 'users.edit',
        method: edit
    },
    {
        name: 'users.createBrokerAccount',
        method: createBrokerAccount
    },
    // {
    //     name: 'users.createLaborAccount',
    //     method: createLaborAccount
    // },
    {
        name: 'users.destroy',
        method: destroy
    },
    {
        name: 'users.usernameCheck',
        method: usernameCheck
    },
    {
        name: 'users.emailCheck',
        method: emailCheck
    },
    {
        name: 'users.abuseDetected',
        method: abuseDetected
    },
    {
        name: 'users.verifyPhone',
        method: checkPhonenumberByOTP
    },
    {
        name: 'users.findByCredentials',
        method: findByCredentials
    },
    // {
    //     name: 'users.generateSession',
    //     method: generateSession
    // },
    {
        name: 'users.updatePassword',
        method: updatePassword
    },
    {
        name: 'users.disableUser',
        method: disableUser
    },
    {
        name: 'users.updatePersonalInfo',
        method: updatePersonalInfo
    },
    {
        name: 'users.updatePersonalPassword',
        method: updatePersonalPassword
    },
    {
        name: 'users.userStatistics',
        method: userStatistics
    }
];

const find = async function (request, h) {
    let query = {};
    if(request.query.keyword){
        query = Object.assign(query,{$or: [ { phone: { $regex: request.query.keyword } }, {  username: { $regex: request.query.keyword } } ]})
    }
    let sort = {}
    sort[request.query.sort] = -1;
    const options = {
        page: request.query.page,
        limit: request.query.limit,
        sort: sort,
        select: 'phone email isActive username'
    };

    return await User.paginate(query, options);
}

// how to prevent user get OTP too many times
// need limit call to this api from same ip + phonenumber
const checkPhonenumberByOTP = async function (request, h) {
    // check if any user got this phone or not
    let phone = await User.findByPhone(request.payload.phone);

    if (phone) {
        throw Boom.conflict('Phone is in used');
    }
    try {
        await AuthAttempt.create({
            ip: request.remoteAddress,
            username: request.payload.phone,
            type: AuthConfig.AUTH_TYPES.CHECK_PHONE
        });
        return await sendOTP({ ...request.payload, ip: request.info.remoteAddress });
    } catch (exception) {
        throw Boom.badRequest(exception.message);
    }
}

const __verifyPhoneOTP = async (phone, verify_code) => {
    const verificationCode = await VerifyPhoneCode.findByPhone(phone)

    if (!verificationCode) {
        throw Boom.notFound('This phone has not been verified yet');
    }

    if (verificationCode.code != verify_code) {
        throw Boom.notFound('Verify code is not correct');
    }

    VerifyPhoneCode.deleteOne({ ...verificationCode });
}

const createBrokerAccount = async function (payload, h) {
    await __verifyPhoneOTP(payload.phone, payload.verify_code)
    const { name, dob, company } = payload;
    const balance = Config.job_balance.register_default_balance;
    const broker = await Broker.create({
        name, dob, company, balance
    });
    return await User.createUser({
        ...payload,
        roles: {
            broker: {
                id: broker._id.toString(),
                name: name
            }
        }
    });
}

const createLaborAccount = async function (payload, h) {
    __verifyPhoneOTP(payload.phone, payload.verify_code)
    const { name, dob, company } = payload;
    const labor = await Labor.create(payload);

    return await User.createUser({
        ...payload,
        roles: {
            labor: {
                id: labor._id,
                name: name
            }
        }
    });
}

const findOne = async function (request, h) {
    let user_data;
    const user = await User.findById(request.params.id).select('-password');
    if (user) {
        let role = Object.keys(user.roles);
        if (role == 'labor') {
            user_data = await Labor.findOne({_id: ObjectId(user.roles.labor.id)});
        } else if (role == 'broker') {
            user_data = await Broker.findOne({_id: ObjectId(user.roles.broker.id)});
        } else {
            throw Boom.notFound('Không tìm thấy tài khoản')
        }

    }

    if (!user) {
        throw Boom.notFound('User not found.');
    }

    let result = {...user.toObject(), users: user_data};

    return result;
}

const edit = async function (request, h) {
    const updateUser = {
        $set: {
            isActive: request.payload.isActive,
            username: request.payload.username,
            email: request.payload.email
        }
    };
    const queryByUserId = {
        'user.id': request.params.id
    };
    const updateRole = {
        $set: {
            'user.name': request.payload.username
        }
    };
    const user = await User.findByIdAndUpdate(request.params.id, updateUser);

    if (!user) {
        throw Boom.notFound('User not found.');
    }

    await Promise.all([
        Account.findOneAndUpdate(queryByUserId, updateRole),
        Admin.findOneAndUpdate(queryByUserId, updateRole)
    ]);

    return user;
}

const destroy = async function (request, h) {
    let role = await User.findOne({_id:request.params.id});

    let type  =  Object.keys(role.roles);
    let _id = role.roles[type].id;
    if(type == "broker"){
        await Broker.deleteOne({_id: ObjectId(_id)})
    }
    if(type == 'labor'){
        await Labor.deleteOne({_id: ObjectId(_id)})
    }
    const user = await User.findByIdAndDelete(request.params.id);

    if (!user) {
        throw Boom.notFound('User not found.');
    }

    return { message: 'Success.' };
}

const updatePassword = async function (request, h) {
    const password = await User.generatePasswordHash(request.payload.password);
    const update = {
        $set: {
            password: password.hash
        }
    };
    const user = await User.findByIdAndUpdate(request.params.id, update);

    if (!user) {
        throw Boom.notFound('User not found.');
    }

    return user;
}

const disableUser = async function (request, h) {
    await User.updateOne({_id: ObjectId(request.params.id)}, {isActive: false});
    return User.findOne({_id: ObjectId(request.params.id)});
}

const updatePersonalInfo = async function (request, h) {
    const userId = `${request.auth.credentials.user._id}`;
    const updateUser = {
        $set: {
            username: request.payload.username,
            email: request.payload.email
        }
    };
    // const findOptions = {
    //     fields: User.fieldsAdapter('username email roles')
    // };
    const queryByUserId = {
        'user.id': userId
    };
    const updateRole = {
        $set: {
            'user.name': request.payload.username
        }
    };
    const [user] = await Promise.all([
        User.findByIdAndUpdate(userId, updateUser).select('username email roles'),
        Account.findOneAndUpdate(queryByUserId, updateRole),
        Admin.findOneAndUpdate(queryByUserId, updateRole)
    ]);

    return user;
}

const updatePersonalPassword = async function (request, h) {
    const userId = `${request.auth.credentials.user._id}`;
    const password = await User.generatePasswordHash(request.payload.password);
    const update = {
        $set: {
            password: password.hash
        }
    };
    const findOptions = {
        fields: User.fieldsAdapter('username email')
    };

    return await User.findByIdAndUpdate(userId, update, findOptions);
}

const usernameCheck = async function (payload, h) {

    const user = await User.findByUsername(payload.phone);

    if (user) {
        throw Boom.conflict('Phone already in use.');
    }

    return h.continue;
};

const emailCheck = async function (payload, h) {

    const user = await User.findByEmail(payload.email);

    if (user) {
        throw Boom.conflict('Email already in use.');
    }

    return h.continue;
};

const abuseDetected = async function (ip, username, h) {
    // const ip = request.remoteAddress;
    // const username = request.payload.username;
    const detected = await AuthAttempt.abuseDetected(ip, username);
    if (detected) {
        throw Boom.badRequest('Maximum number of auth attempts reached.');
    }

    return h.continue;
}

const findByCredentials = async function(payload, h) {
    const info = await User.findByCredentials(payload.username, payload.password);
    if (!info) {
        throw Boom.notFound('Invalid login credentials');
    }
    return info;
}

const userStatistics = async function (request, h) {
    let start_date = request.query.start_date;
    start_date = moment(start_date).startOf('day');
    let end_date = request.query.end_date;
    end_date = moment(end_date).startOf('day');
    return {
        user: await User.countDocuments({
            timeCreated: {
                $gte: new Date(start_date),
                $lt: new Date(end_date),
            }
        }), total:
            await
                User.countDocuments({})
    }

}
