const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const MongoModels = require('mongo-models');
const NewDate = require('joistick/new-date');
const Boom = require('boom');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const JobSchema = new Schema({
    created_at: { type: Date },
    state: { type: String },
    task_name: { type: String },
    SIGNATURE: {
        uuid: { type: String },
        name: { type: String },
        routingkey: { type: String },
        eta: { type: String },
        groupuuid: { type: String },
        grouptaskcount: { type: Number },
        args: [Schema.Types.Mixed],
        headers: {},
        priority: { type: Number },
        immutable: { type: Boolean },
        retrycount: { type: Number },
        retrytimeout: { type: Number },
        onsuccess: { type: Object },
        onerror: { type: Object },
        chordcallback: { type: Object },
        brokermessagegroupid: { type: String },
        sqsreceipthandle: { type: String },
        stoptaskdeletiononerror: { type: Boolean },
        ignorewhentasknotregistered: { type: Boolean },
    },
},
    {
        timestamps: {
            createdAt: 'timeCreated'
        }
    }
);

JobSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('tasks', JobSchema);