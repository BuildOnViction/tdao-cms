var Config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
var ObjectId = require('mongodb').ObjectId;
module.exports = (server, options) => [
    {
        name: 'transactions.getList',
        method: getListTransactions
    },
]

const getListTransactions = async function (request, h) {
    const { collection, client } = await getTransactionConnection("api")

    const transactions = await collection.find({}).sort({$natural:1}).limit(100);

    client.close()
    return transactions
}


const getTransactionConnection = async function (env) {
    const {uri, dbName} = Config.transactionUri[env]
    const client = await MongoClient.connect(uri, {});
    const db = client.db(dbName);
    const collection = db.collection('transactions');

    return { collection, client }
};