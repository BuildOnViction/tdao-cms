var Config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
var ObjectId = require('mongodb').ObjectId;
const Uuid = require('uuid');
module.exports = (server, options) => [
    {
        name: 'addresses.getList',
        method: getListAddresses
    },
    {
        name: 'addresses.scanBalance',
        method: getListBalance
    },
    {
        name: 'addresses.transferBalance',
        method: transferBalance
    },
]

const getListAddresses = async function (request, h) {
    const { collection, client } = await getAddressConnection("wallet")
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


const getAddressConnection = async function (env, clname) {
    const { uri, dbName } = Config.transactionUri[env]
    console.log(uri, dbName)
    const client = await MongoClient.connect(uri, {});
    const db = client.db(dbName);
    const collection = db.collection(clname || 'registered_addrs');

    return { collection, client }
};

var Web3 = require("web3");
const { Error } = require('mongoose');
var web3 = new Web3(
    Web3.givenProvider ||
    "https://mainnet.infura.io/v3/1c7781ad13f54fa8a315471249a75a4c"
);

const tokenInfo = [
    {
        name: "ETH",
        decimals: 18,
    },
    {
        name: "USDT",
        decimals: 6,
        sc: "0xdac17f958d2ee523a2206206994597c13d831ec7"
    },
    {
        name: "YFI",
        decimals: 18,
        sc: "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e"
    },
    {
        name: "VNDC",
        decimals: 1,
        sc: "0x1f3f677ecc58f6a1f9e2cf410df4776a8546b5de"
    },
    {
        name: "FTT",
        decimals: 18,
        sc: "0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9"
    },
    {
        name: "DEC",
        decimals: 18,
        sc: "0x30f271c9e86d2b7d00a6376cd96a1cfbd5f0b9b3"
    },
    {
        name: "SRM",
        decimals: 18,
        sc: "0x476c5e26a75bd202a9683ffd34359c0cc15be0ff"
    },

];


const showERCBalanceToken = async function (coin, addresses) {

    const abi = [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_from",
                    "type": "address"
                },
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "name": "_spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        }
    ]

    let token = null
    for (let index = 0; index < tokenInfo.length; index++) {
        const element = tokenInfo[index];
        if (element.name == coin) {
            token = element
            break;
        }
    }

    if (token == null) {
        throw new Error("Your token is not supported yet")
    }

    const contract = new web3.eth.Contract(abi, token.sc);
    return new Promise((resolve, reject) => {
        let scannedAddresses = 0
        let data = []
        addresses.forEach((address) => {
            const balanceOfTx = contract.methods.balanceOf(address).call()
                .then(res => {
                    scannedAddresses++
                    // if (res > 0) {
                        data.push({
                            address: address,
                            balance: res
                        });
                    // }
                    if (scannedAddresses == addresses.length) {
                        resolve(data)
                    }
                })
                .catch(function (ex) {
                    scannedAddresses++
                    if (scannedAddresses == addresses.length) {
                        resolve(data)
                    }
                });
        });
    })
}

const getListBalance = async function (request, h) {
    const { collection, client } = await getAddressConnection("wallet", "transactions")

    return new Promise((resolve, reject) => {
        collection
            .distinct("to", {
                "cointype": request.query.coin,
            })
            .then(function (result) {
                if (result.length == 0) {
                    return resolve([])
                }
                resolve(showERCBalanceToken(request.query.coin, result))
            })
            .catch(function (ex) {
                console.log("ex ", ex);
                reject(ex)
            });

    });
}

const transferBalance = async function (request, h) {
    // get account Index by address
    const { collection, client } = await getAddressConnection("wallet")

    return new Promise((resolve, reject) => {
        collection
            .findOne({
                coin: request.query.coin,
                address: request.query.address,
            }).then(res => {
                console.log("issued address ", res)
                let signature = {
                    "uuid": "",
                    "name": "transfer_balance",
                    "routingkey": "gpcwalletlocal",
                    "eta": "2020-08-04T06:40:56.308Z",
                    "groupuuid": "",
                    "grouptaskcount": 0,
                    "args": [
                        {
                            "name": "",
                            "type": "string",
                            "value": res.index + ""
                        },
                        {
                            "name": "",
                            "type": "string",
                            "value": "0x36f4b7a8d3d9975ae4c00ad1b699cb0f6dc20939"
                        },
                        {
                            "name": "",
                            "type": "string",
                            "value": "{\"BlockNumber\":10591729,\"BlockHash\":\"\",\"Hash\":\"\",\"CoinType\":\"\",\"From\":\"\",\"To\":\"\",\"Amount\":\"\",\"Timestamp\":\"2020-08-04T06:40:25.070656673Z\",\"Data\":\"\",\"Confirmations\":0,\"Status\":\"DEPOSITING\",\"ScID\":\"\"}"
                        }
                    ],
                    "headers": {},
                    "priority": 0,
                    "immutable": false,
                    "retrycount": 20,
                    "retrytimeout": 0,
                    "onsuccess": null,
                    "onerror": null,
                    "chordcallback": null,
                    "brokermessagegroupid": "",
                    "sqsreceipthandle": "",
                    "stoptaskdeletiononerror": false,
                    "ignorewhentasknotregistered": true
                }

                const key = Uuid.v4();
                signature.uuid = "task_" + key

                const Redis = require('ioredis');
                let result
                const redis = new Redis("redis://localhost:6379/1");
                const dataBuffer = Buffer.from(JSON.stringify(signature));
                redis.rpush(signature.routingkey, dataBuffer)
                    .then(result => {
                        redis.disconnect();
                        resolve({
                            uuid: signature.uuid,
                            messageId: result,
                        })
                    }).catch(err => {
                        reject(err)
                    })
            }).catch(err => {
                reject(err)
            })
    })
}