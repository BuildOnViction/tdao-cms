const BaseJoi = require('joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);
const MongoModels = require('mongo-models');

const schema = Joi.object({
    _id: Joi.object(),
    created_at: Joi.date(),
    state: Joi.string(),
    task_name: Joi.string(),
    SIGNATURE: Joi.object({
        uuid: Joi.string(),
        name: Joi.string(),
        routingkey: Joi.string(),
        eta: Joi.string(),
        groupuuid: Joi.string(),
        grouptaskcount: Joi.number(),
        args: Joi.array(),
        headers: Joi.any(),
        priority: Joi.number(),
        immutable: Joi.bool(),
        retrycount: Joi.number(),
        retrytimeout: Joi.number(),
        onsuccess: Joi.any(),
        onerror: Joi.any(),
        chordcallback: Joi.any(),
        brokermessagegroupid: Joi.string(),
        sqsreceipthandle: Joi.string(),
        stoptaskdeletiononerror: Joi.bool(),
        ignorewhentasknotregistered: Joi.bool(),
    }),
}).unknown(true);

class Task extends MongoModels {
}

Task.collectionName = 'tasks'; // the mongodb collection name
Task.schema = schema;


module.exports = Task;