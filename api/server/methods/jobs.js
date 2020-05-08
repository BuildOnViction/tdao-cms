const Jobs = require('../models/job');
const Tasks = require('../models/task');
const JobTypes = require('../models/job_type');
const MongoClient = require('mongodb').MongoClient;
const Brokers = require('../models/broker');
const Boom = require('boom');
var ObjectId = require('mongodb').ObjectId;
var slugify = require('slugify');
var Config = require('../config');
const MongoModels = require('mongo-models');
const Hoek = require('@hapi/hoek');
const {PubSub}  = require('@google-cloud/pubsub');
const Uuid = require('uuid');

module.exports = (server, options) => [
    {
        name: 'jobs.jobCreate',
        method: jobCreate
    },
    {
        name: 'jobs.jobUpdate',
        method: jobUpdate
    },
    {
        name: 'jobs.jobDelete',
        method: jobDelete
    },
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
        name: 'jobs.jobSearch',
        method: jobSearch
    },
    {
        name: 'jobs.activejob',
        method: activejob
    }
];

const jobCreate = async function (request, h) {
    let broker_id = request.payload.broker_id;
    let broker = await Brokers.findOne({ _id: ObjectId(broker_id) });
    let blance = parseInt(broker.balance);
    if (blance >= Config.job_balance.jobs_default_balance) {
        var title = request.payload.title;
        var slug = slugify(title, '-');
        var dataSlug;
        var number = 0;
        if (await Jobs.countDocuments({ slug: slug }) == 0) {
            dataSlug = { slug: slug };
        } else {
            while (true) {
                number++;
                if (await Jobs.countDocuments({ slug: slug + "-" + number }) == 0) {
                    dataSlug = { slug: slug + "-" + number };
                    break;
                }

            }
        }

        let data = Object.assign(request.payload, { broker_id: broker_id }, dataSlug);
        console.log(data);
        let job = await Jobs.create(data);
        if (job) {
            blance -= Config.job_balance.jobs_default_balance;
            await Brokers.findByIdAndUpdate(ObjectId(broker_id), { $set: { balance: blance } })
        }
        return job;
    } else {
        throw Boom.paymentRequired('You not have enough money')
    }

};
const jobUpdate = async function (request, h) {
    let id = request.params.id;
    let broker_id = request.payload.broker_id;
    if (!broker_id) {
        throw Boom.notFound('Not found user id')
    }
    var title = request.payload.title;
    var slug = slugify(title, '-');
    var dataSlug;
    var number = 0;
    if (await Jobs.countDocuments({ slug: slug, _id: ObjectId(id) }) == 1) {
        dataSlug = { slug: slug };
    } else {
        if (await Jobs.countDocuments({ $and: [{ slug: slug, _id: { $ne: ObjectId(id) } }] }) == 0) {
            dataSlug = { slug: slug };
        } else {
            while (true) {
                number++;
                if (await Jobs.countDocuments({ slug: slug + "-" + number }) == 0) {
                    dataSlug = { slug: slug + "-" + number };
                    break;
                }

            }
        }

    }

    let data = Object.assign(request.payload, { broker_id: broker_id }, dataSlug);
    let contract = await Jobs.updateOne({ _id: ObjectId(id) }, data);
    contract = await Jobs.findOne({ _id: ObjectId(id) });
    if (!contract) {
        throw Boom.notFound('Contract not found.');
    }

    return contract;
};


const jobDelete = async function (request, h) {
    let id = request.params.id;
    const contract = await Jobs.deleteOne({ _id: ObjectId(id) });
    return contract;
};

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
        filter["state"] = {
            $ne: "PENDING"
        }
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
    let uri = ""
    let dbName = ""
    switch (env) {
        case "wallet":
            uri = "mongodb://machinery_wallet:anhlavip@206.189.39.242:27017/machinery_wallet"
            dbName = "machinery_wallet"
            break;
        case "proxy":
            uri = "mongodb://machinery_proxy:anhlavip@206.189.39.242:27017/machinery_proxy"
            dbName = "machinery_proxy"
            break;
        case "master":
            uri = "mongodb://machinery_job:anhlavip@206.189.39.242:27017/machinery_job"
            dbName = "machinery_job"
            break;
        case "verifier":
            uri = "mongodb://machinery_job1:anhlavip@206.189.39.242:27017/machinery_job1"
            dbName = "machinery_job1"
            break;
        case "api":
            uri = "mongodb://machinery_api:anhlavip@206.189.39.242:27017/machinery_api"
            dbName = "machinery_api"
            break;
        default:
            break;
    }

    const client = await MongoClient.connect(uri, {});
    const db = client.db(dbName);
    const collection = db.collection('tasks');

    return { collection, client }
};

const jobDetail = async function (request, h) {
    const { collection, client } = await getConnection(request.query.from_node)

    const task = await collection.findOne({ _id: request.params.id })
    console.log("request.params.id ", request.params.id)
    client.close()
    return task
};
const jobSearch = async function (request, h) {
    let object = {};
    let options = {
        page: request.query.page,
        limit: request.query.limit,
        sort: {
            _id: -1
        },
        select: 'title country cv_location status',
    };
    if (request.query.keywords) {
        object = Object.assign(object, { $text: { $search: request.query.keywords } });
        options = {
            page: request.query.page,
            limit: request.query.limit,
            projection: { score: { $meta: "textScore" } },
            sort: { score: { $meta: "textScore" } },
            select: 'title country cv_location status',
        }

    }
    if (request.query.country) {
        object = Object.assign(object, { "country": request.query.country })
    }
    if (request.query.salaryfrom) {
        object = Object.assign(object, { "salary.from": { $gte: request.query.salaryfrom } })
    }
    if (request.query.salaryto) {
        object = Object.assign(object, { "salary.to": { $lte: request.query.salaryto } })
    }
    if (request.query.jobType) {
        let job_types = await JobTypes.findOne({ slug: request.query.jobType });
        if (job_types) {
            object = Object.assign(object, { job_type: { $elemMatch: { id: job_types._id } } });
        }
    }
    if (request.query.status) {
        object = Object.assign(object, { "status": request.query.status })

    }
    return await Jobs.paginate(object, options);

}

const activejob = async function (request, h) {
    await Jobs.findOneAndUpdate({ _id: ObjectId(request.params.id), status: 'draft' }, { status: 'active' });
    return await Jobs.findOne({ _id: ObjectId(request.params.id) });
}

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