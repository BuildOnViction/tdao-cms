const Jobs = require('../models/job');
const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
var ObjectId = require('mongodb').ObjectId;
var slugify = require('slugify');
var Config = require('../config');
const MongoModels = require('mongo-models');
const Hoek = require('@hapi/hoek');
const {PubSub}  = require('@google-cloud/pubsub');
const Uuid = require('uuid');

module.exports = (server, options) => [
    // {
    //     name: 'jobs.jobDelete',
    //     method: jobDelete
    // },
    {
        name: 'jobs.getList',
        method: getList
    },
    {
        name: 'jobs.jobDetail',
        method: jobDetail
    },
    {
        name: 'jobs.relayJob',
        method: relayJob
    },
    {
        name: 'jobs.deleteJob',
        method: deleteJob
    }
];


// const jobDelete = async function (request, h) {
//     let id = request.params.id;
//     const contract = await Jobs.deleteOne({ _id: ObjectId(id) });
//     return contract;
// };

const getList = async function (request, h) {
    const { collection, client } = await getConnection(request.query.from_node)

    let filter = {}

    if (request.query.task_id) {
        filter = {
            task_id: request.query.task_id
        }
    }

    if (request.query.status !== "ALL") {
        filter["state"] = request.query.status || "FAILURE"
    } else {
        // filter["state"] = {
            // $ne: "PENDING"
        // }
    }

    return new Promise((resolve, reject) => {
        collection
            .find(filter)
            .sort({ $natural: -1 })
            .skip((request.query.page - 1) * request.query.limit)
            .limit(request.query.limit)
            .toArray(function (err, result) {
                client.close();
                if (err) {
                    return reject(err)
                }

                resolve(result)
            })
    });
};

const getConnection = async function (env) {
    const {uri, dbName} = Config.tasksUri[env]
    const client = await MongoClient.connect(uri, {});
    const db = client.db(dbName);
    const collection = db.collection('tasks');

    return { collection, client }
};

const jobDetail = async function (request, h) {
    const { collection, client } = await getConnection(request.query.from_node)

    const task = await collection.findOne({ _id: request.params.id })
    client.close()
    return task
};

const relayJob = async function (request, h) {
    let signature = request.payload
    console.log(" signature ", signature)
    const key = Uuid.v4();
    signature.uuid = "task_" + key

    // Instantiates a client
    const pubsub = new PubSub({ projectId: Config.remotePubsub.projectId });
    
    // Creates the new topic
    const dataBuffer = Buffer.from(JSON.stringify(signature));
    const topic = pubsub.topic(Config.remotePubsub.topic)

    const messageId = await topic.publish(dataBuffer);
    
    console.log(`Message ${messageId} published.`);
    return {
        uuid: signature.uuid,
        messageId: messageId
    }
}


const deleteJob = async function (request, h) {
    let signature = request.payload
    console.log(" signature ", signature)
    const key = Uuid.v4();
    signature.uuid = "task_" + key

    // Instantiates a client
    const pubsub = new PubSub({ projectId: Config.remotePubsub.projectId });
    
    // Creates the new topic
    const dataBuffer = Buffer.from(JSON.stringify(signature));
    const topic = pubsub.topic(Config.remotePubsub.topic)

    const messageId = await topic.publish(dataBuffer);
    
    console.log(`Message ${messageId} published.`);
    return {
        uuid: signature.uuid,
        messageId: messageId
    }
}