'use strict';
const MongoModels = require('mongo-models');


const Admin = require('./server/models/admin');

const Config = require('./server/config');
var ObjectId = require('mongodb').ObjectId;
const slugify = require('slugify');

const main = async function () {

    let mongoConfig = Config.hapiMongoModels.mongodb.connection;
    // connect to db
    require('./server/db/db');
    const db = await MongoModels.connect({
        uri: mongoConfig.uri,
        db: mongoConfig.db
    });
    await Promise.all([
        // Job.deleteMany(),
        Admin.deleteMany({}),

    ]);
    if (!db) {
        throw Error('Could not connect to MongoDB.');
    }
    // clear tables

    //permission create
    const passwordHash = await Admin.generatePasswordHash('123456789');
    await Admin.create({
        name: "admin",
        email: "admin@gmail.com",
        password: passwordHash.hash,
        roles: "admin",
    });
    await Admin.create({
        name: "admin",
        email: "admin2@gmail.com",
        password: passwordHash.hash,
        roles: "editor",
    });


    // all done

    MongoModels.disconnect();

    console.log('First time setup complete.');

    process.exit(0);
};

main().catch((err) => {
    console.log('First time setup failed.');
    console.error(err);
    MongoModels.disconnect();
    process.exit(1);
});
//