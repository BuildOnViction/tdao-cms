'use strict';

const jobType = require('./server/models/job_type');
const Config = require('./server/config');
const MongoModels = require('mongo-models');
const data = require('./seed-data-set/job-type-mongo.json');
const Job = require('./server/models/job');

let mongoConfig = Config.hapiMongoModels.mongodb.connection;
// connect to db
const main = async function () {

    const db = await MongoModels.connect({
        uri: mongoConfig.uri,
        db: mongoConfig.db
    });

    if (!db) {
        throw Error('Could not connect to MongoDB.');
    }
    let jobs = await Job.find({});
    jobs.forEach(function (job) {
        let deadline = job.deadline.toString();
        let data = Job.findByIdAndUpdate(job._id,{$set:{deadline:deadline.replace(/\//g, "-")}});
    })


};


main().catch((err) => {
    console.log('First time setup failed.');
    console.error(err);
    MongoModels.disconnect();
    process.exit(1);
});