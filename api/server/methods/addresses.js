var Config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
var ObjectId = require('mongodb').ObjectId;
module.exports = (server, options) => [
    {
        name: 'addresses.getList',
        method: getListAddresses
    },
]

const getListAddresses = async function (request, h) {
    const { collection, client } = await getAddressConnection("api")
    let filter = {}
    let $and = []
    if (request.query.address) {
        $and.push({
            "$or": [
                {
                    "tomo": new RegExp(["^", request.query.address, "$"].join(""), "i")
                },
                {
                    "address": new RegExp(["^", request.query.address, "$"].join(""), "i")
                }
            ]
        })
    }

    if (request.query.coin) {
        filter["coin"] = request.query.coin.toUpperCase()
    }

    if ($and.length > 0) {
        filter["$and"] = $and
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
}


const getAddressConnection = async function (env) {
    const {uri, dbName} = Config.transactionUri[env]
    const client = await MongoClient.connect(uri, {});
    const db = client.db(dbName);
    const collection = db.collection('registered_addrs');

    return { collection, client }
};