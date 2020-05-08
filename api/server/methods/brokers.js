'use strict';

const Chalk = require('chalk');
const Jobs = require('../models/job');
const Boom = require('boom');
const _ = require('lodash');
const Contract = require('../models/contract');
const Company = require('../models/company');
var ObjectId = require('mongodb').ObjectId;
const User = require('../models/user');
const Broker = require('../models/broker');
const Config = require('../config');
module.exports = (server, options) => [
    {
        name: 'brokers.create',
        method: createBrokerAccount
    },
    {
        name: 'brokers.list',
        method: listBroker
    },
    {
        name: 'brokers.delete',
        method: deleteBroker
    },
    {
        name: 'brokers.listJob',
        method: listJob
    },
    {
        name: 'brokers.detail',
        method: detailBroker
    },
    {
        name: 'brokers.edit',
        method: editBroker
    },
    {
        name: "brokers.detailBrokerByBrokerID",
        method: detailBrokerByBrokerID
    },
    {
        name: "brokers.listBrokerPaginage",
        method: listBrokerPaginage

    }
];

const createBrokerAccount = async function (payload, h) {
    const {name, dob, company, introduce} = payload;
    let phone = await User.countDocuments({username: payload.phone});
    if (parseInt(phone) > 0) {
        throw Boom.badRequest('Điện thoại đã tồn tại');
    }
    if ((payload.company && payload.company.id && !payload.company.name) || (payload.company && payload.company.name && !payload.company.id)) {
        throw Boom.badData('Company phải cố tên và id');
    }
    if (payload.company && payload.company.id && payload.company.name) {
        if (await Company.countDocuments({_id: ObjectId(payload.company.id), name: payload.company.name}) < 1) {
            throw Boom.notFound('Không tìm thấy company');
        }
    }
    const balance = Config.job_balance.register_default_balance;
    const broker = await Broker.create({
        name, dob, company, balance, introduce
    });
    try {
        return await User.createUser({
            ...payload,
            roles: {
                broker: {
                    id: broker._id.toString(),
                    name: name
                }
            }
        });
    }catch (e) {
        if(e.code = 11000){
            throw Boom.badData('Email đã tồn tại')
        }
    }
};


const listBroker = async function(request, h) {
    return await User.find({owner: true}).select('-password');
};
const listBrokerPaginage = async function (request, h) {
    const options = {
        page: request.query.page,
        limit: request.query.limit,
        select: '-password',
        sort: {
            _id: -1
        }
    };
    let broker = await User.paginate({owner: true}, options);
    return broker;
};
const detailBroker = async function(request, h) {
    let user = await User.findOne({_id: ObjectId(request.params.id)}).select('-password');
    if(!user){
        throw Boom.notFound('Không tìm thấy người môi giới')
    }
    return {user:user, broker:await Broker.findOne({_id:ObjectId(user.roles.broker.id)})};
};
const detailBrokerByBrokerID = async function (request, h) {
    let broker = await Broker.findOne({_id: ObjectId(request.params.id)});
    if (!broker) {
        throw Boom.notFound('Không tìm thấy người môi giới')
    }
    return broker;
};
const deleteBroker = async function(request, h) {
    let user = await User.findOne({_id: ObjectId(request.params.id)});
        await Broker.deleteOne({_id: ObjectId(user.roles.broker.id)});
    return await User.deleteOne({_id: ObjectId(request.params.id)});

}

const listJob = async function(request, h) {
    const options = {
        page: request.query.page,
        limit: request.query.limit,
        select: 'title country cv_location',
        sort:{
            _id: -1
        }
    };
    let job = await Jobs.paginate({broker_id:request.params.brocker_id}, options);
    return job
};

const editBroker = async function(request, h) {
    let phone = await User.countDocuments({phone: request.payload.phone, _id: {$ne: ObjectId(request.params.id)}});
    if(phone > 0){
        throw Boom.badRequest('Điện thoại đã tồn tại');
    }
    let email = await User.countDocuments({email: request.payload.email, _id: {$ne: ObjectId(request.params.id)}});
    if (email > 0) {
        throw Boom.badRequest('Email đã tồn tại');
    }
    let data = {phone:request.payload.phone, username:request.payload.phone, email: request.payload.email};
    if (request.payload.avatar) {
        data = Object.assign(data, {avatar: request.payload.avatar});
    }
    if(request.payload.password){
        let password = await User.generatePasswordHash(request.payload.password);
        data = Object.assign(data, {password: password.hash})
    }
    let users = await User.findOneAndUpdate({_id:ObjectId(request.params.id)},data);
    if(users){
        await Broker.findOneAndUpdate({_id:ObjectId(users.roles.broker.id)}, request.payload)
    }
    return {user: await User.findOne({_id:ObjectId(request.params.id)}), broker: await Broker.findOne({_id:ObjectId(users.roles.broker.id)})}

}
