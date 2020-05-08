'use strict';

const Boom = require('boom');
const Admin = require('../models/admin');
var Config = require('../config');
const AuthConfig = require('../runtime/auth-attemp');
var ObjectId = require('mongodb').ObjectId;

module.exports = (server, options) => [
    {
        name: 'admins.findByCredentials',
        method: findByCredentials,
    },
    {
        name: 'admins.addAdmin',
        method: addAdmin
    },
    {
        name: 'admins.editAdmin',
        method: editAdmin
    },
    {
        name: 'admins.detailAdmin',
        method: detailAdmin
    },
    {
        name: 'admins.listAdmin',
        method: listAdmin
    },
    {
        name: 'admins.deleteAdmin',
        method: deleteAdmin
    }

];

const findByCredentials = async function(payload, h) {
    const info = await Admin.findByCredentials(payload.email, payload.password);
    if (!info) {
        throw Boom.notFound('Invalid login credentials');
    }
    return info;
};


const addAdmin = async function (request, h) {
    if (await Admin.countDocuments({email: request.payload.email}) > 0) {
        throw Boom.badRequest('Email của admin đã tồn tại')
    }
    return await Admin.create({
        name: request.payload.name,
        email: request.payload.email,
        password: await Admin.generatePasswordHash(request.payload.password).hash,
        roles: request.payload.roles
    })
};
const editAdmin = async function(request, h) {
    let filter ={};
    if(request.payload.name){
        filter = Object.assign(filter, {name: request.payload.name})
    }
    if(request.payload.email){
        if (await Admin.countDocuments({email: request.payload.email, _id: {$ne: ObjectId(request.params.id)}}) > 0) {
            throw Boom.badRequest('Email của admin đã tồn tại')
        }
        filter = Object.assign(filter, {email: request.payload.email})
    }
    if(request.payload.password){
        let password = await Admin.generatePasswordHash(request.payload.password);
        filter = Object.assign(filter, {password: password.hash})
    }
    if(request.payload.roles){
        filter = Object.assign(filter, {roles: request.payload.roles})
    }
    await Admin.findOneAndUpdate({_id: ObjectId(request.params.id)}, filter);
    return await Admin.findOne({_id: ObjectId(request.params.id)});

};

const listAdmin = async function(request, h) {
    let filter ={};
    let sort = {}
    sort[request.query.sort] = -1;
    const options = {
        page: request.query.page,
        limit: request.query.limit,
        sort :sort,
        select: '-password'
    };
    return await Admin.paginate(filter, options);

};
const detailAdmin = async function(request, h) {
    return await Admin.findOne({_id:ObjectId(request.params.id)});

};

const deleteAdmin = async function(request, h) {
    return Admin.findOneAndRemove({_id: ObjectId(request.params.id)})

};