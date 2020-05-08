'use strict';
const MongoModels = require('mongo-models');
const Config = require('../server/config');
const Company = require('../server/models/company');
const JobTypes = require('../server/models/profession');
const companies = require('./companies.json');
const jobtypes = require('./job-type.json');

const createInitialData = async () => {
    let mongoConfig = Config.hapiMongoModels.mongodb.connection;

    // connect to db
    const db = await MongoModels.connect({
        uri: mongoConfig.uri,
        db: mongoConfig.db
    });

    if (!db) {
        throw Error('Could not connect to MongoDB.');
    }

    await Promise.all([
        Company.deleteMany({}),
        JobTypes.deleteMany({}),
    ]);

    // create company data
    await JobTypes.insertMany(
        jobtypes.map((type) => {
            return new JobTypes({
                name: type
            })
        })
    )

    await Company.insertMany(
        companies.map((company) => {
            return new Company({
                ...company,
                global_name: company.global_name || company.name
            })
        })
    )
    // create some fixed users

    MongoModels.disconnect();

    console.log('First time setup complete.');

    process.exit(0);
}

createInitialData().catch((err) => {
    console.error(err);
    MongoModels.disconnect();
    process.exit(1);
});
