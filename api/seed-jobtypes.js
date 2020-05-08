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
    jobType.deleteMany();
    let finallyJob = [];
    data.forEach(function (element) {
        let splitType = element.split('\n');
        splitType.forEach(function (sp) {
            let check = finallyJob.find(function (e) {
                return e == sp;
            })
            if (sp != null && sp != '' && sp != undefined && !check) {
                finallyJob.push(sp)
            }
        });
    });
    finallyJob.forEach(async function (name) {
        let result = await jobType.insertOne({name: name});
    });
    let job_type_all = await jobType.find();
    await Job.updateMany({}, {
        "$set":
            {"job_type": []}
    });
        job_type_all.forEach(async function (jobdata) {
            let bk = await Job.updateMany({professions_instring: {$regex: jobdata.name}}, {
                "$push":
                    {
                        "job_type":
                            {
                                "id": jobdata._id.toString(),
                                "name": jobdata.name
                            }
                    }
            });
        });




};


main().catch((err) => {
    console.log('First time setup failed.');
    console.error(err);
    MongoModels.disconnect();
    process.exit(1);
});