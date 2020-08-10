var Config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
const { strict } = require('joi');
var ObjectId = require('mongodb').ObjectId;
module.exports = (server, options) => [
    {
        name: 'transactions.getList',
        method: getListTransactions
    },
    {
        name: 'transactions.rescan',
        method: rescanTransaction
    },
]

const getListTransactions = async function (request, h) {
    const { collection, client } = await getTransactionConnection("api")
    let filter = {}
    let $and = []
    if (request.query.from_address) {
        $and.push({
            "$or": [
                {
                    "intx.from": request.query.from_address
                },
                {
                    "outtx.to": request.query.from_address
                }
            ]
        })
    }

    if (request.query.coin_type && request.query.coin_type !== "ALL") {
        filter["intx.cointype"] = request.query.coin_type
    }

    if (request.query.hash) {
        $and.push({
            "$or": [
                {
                    "intx.hash": new RegExp(["^", request.query.hash, "$"].join(""), "i")
                },
                {
                    "outtx.hash": new RegExp(["^", request.query.hash, "$"].join(""), "i")
                }
            ]
        })

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


const rescanTransaction = async function (request, h) {
    const { exec } = require('child_process');

    console.log("request.query ", request.query)
    exec("cd " + Config.bridgejobPATH + " && " + Config.bridgejobCLI + ' rescan ' + request.query.coin + " " + request.query.blockNumber + " " + request.query.coinAddress, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    
    
    return {}
}


const getTransactionConnection = async function (env) {
    const { uri, dbName } = Config.transactionUri[env]
    const client = await MongoClient.connect(uri, {});
    const db = client.db(dbName);
    const collection = db.collection('transactions');

    return { collection, client }
};