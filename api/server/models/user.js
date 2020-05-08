'use strict';
const Broker = require('./broker');
const Labor = require('./labor');
const Admin = require('./admin');
const Assert = require('assert');
const Bcrypt = require('bcryptjs');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const NewDate = require('joistick/new-date');
const Boom = require('boom');


const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const Schema = mongoose.Schema;

const UserSchema = new Schema({
        email: {type: String},
        phone: {type: String},
        isActive: {type: Boolean},
        avatar: Object,
        password: {
            type: String,
            select: false
        },
        resetPassword: {
            token: {type: String},
            expires: {type: String}
        },
        roles: {},
        owner: Boolean,
        username: {type: String}
    },
    {
        timestamps: {
            createdAt: 'timeCreated'
        }
    }
);


UserSchema.plugin(mongoosePaginate);

UserSchema.statics.createUser = async function ({username, password, email, phone, roles, avatar, owner}) {

    console.log(avatar);
    Assert.ok(password, 'Missing password argument.');
    Assert.ok(phone, 'Missing phone argument.');

    const passwordHash = await this.generatePasswordHash(password);
    const document = new this({
        owner,
        phone,
        email,
        avatar: avatar,
        isActive: true,
        password: passwordHash.hash,
        username: username || phone,
        roles
    });
    const users = await this.create(document);

    // users[0].password = passwordHash.password;
    delete users.password;
    return users;
}

UserSchema.statics.findByCredentials = async function (username, password) {

    Assert.ok(username, 'Missing username argument.');
    Assert.ok(password, 'Missing password argument.');

    const query = {
        isActive: true,
        username
    };

    const user = await this.findOne(query).select('+password');

    if (!user) {
        return;
    }

    const passwordMatch = await Bcrypt.compare(password, user.password);

    if (passwordMatch) {
        const returnUser = user.toObject();
        delete returnUser.password;
        return returnUser;
    } else {
        throw Boom.notFound('Wrong login info');
    }
}

UserSchema.statics.findByEmail = async function (email) {

    Assert.ok(email, 'Missing email argument.');

    const query = {email: email.toLowerCase()};

    return this.findOne(query);
}

UserSchema.statics.findByPhone = async function (phone) {

    Assert.ok(phone, 'Missing phone argument.');

    const query = {phone};

    return this.findOne(query);
}

UserSchema.statics.findByUsername = async function (username) {

    Assert.ok(username, 'Missing username argument.');

    const query = {username: username.toLowerCase()};

    return this.findOne(query);
}

UserSchema.statics.generatePasswordHash = async function (password) {

    Assert.ok(password, 'Missing password argument.');

    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(password, salt);

    return {password, hash};
}


UserSchema.statics.canPlayRole = async function (role) {

    Assert.ok(role, 'Missing role argument.');

    return this.roles.hasOwnProperty(role);
}

UserSchema.methods.hydrateRole = async function () {
    if (this._role) {
        return this._role;
    }
    this._role = {};
    // multiple roles - wont use right now - just single role
    if (this.roles.broker) {
        let broker = await Broker.findById(this.roles.broker.id);
        this._role = {...broker.toObject()};
        this._role.type = 'broker';
    } else if (this.roles.labor) {
        let labor = await Labor.findById(this.roles.labor.id);
        this._role = {...labor.toObject()};
        this._role.type = 'labor';
    }
    return this._role;
}

UserSchema.statics.linkAccount = async function (id, name) {

    Assert.ok(id, 'Missing id argument.');
    Assert.ok(name, 'Missing name argument.');

    const update = {
        $set: {
            'roles.account': {id, name}
        }
    };

    return await User.findByIdAndUpdate(this._id, update);
}

UserSchema.statics.linkAdmin = async function (id, name) {

    Assert.ok(id, 'Missing id argument.');
    Assert.ok(name, 'Missing name argument.');

    const update = {
        $set: {
            'roles.admin': {id, name}
        }
    };

    return await User.findByIdAndUpdate(this._id, update);
}

UserSchema.statics.unlinkAccount = async function () {

    const update = {
        $unset: {
            'roles.account': undefined
        }
    };

    return await User.findByIdAndUpdate(this._id, update);
}

UserSchema.statics.unlinkAdmin = async function () {

    const update = {
        $unset: {
            'roles.admin': undefined
        }
    };

    return await User.findByIdAndUpdate(this._id, update);
}

UserSchema.index({username: 1, phone: 1}, {unique: true});

module.exports = mongoose.model('users', UserSchema);