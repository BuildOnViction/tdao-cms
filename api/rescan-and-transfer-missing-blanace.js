"use strict";
const MongoModels = require("mongo-models");
const MongoClient = require("mongodb").MongoClient;
var Web3 = require("web3");
var web3 = new Web3(
    Web3.givenProvider ||
        "https://mainnet.infura.io/v3/1c7781ad13f54fa8a315471249a75a4c"
);

const main = async function () {
    let uri = "mongodb://tomobridge:anhlavip@206.189.39.242:27017/tomobridge";
    let dbName = "tomobridge";
    const client = await MongoClient.connect(uri, {});
    const db = client.db(dbName);
    const collection = db.collection("transactions");

    return new Promise((resolve, reject) => {
        collection
            .distinct("intx.to", {
                "intx.cointype": {
                    $in: ["USDT", "ETH", "YFI"],
                },
            })
            .then(function (result) {
                resolve(result);
            })
            .catch(function (ex) {
                console.log("ex ", ex);
                reject(ex)
            });
    })
    

};

const tokenInfo = [
    {
        name: "ETH",
        decimals: 18,
        explorerUrl:
            "https://mainnet.infura.io/v3/1c7781ad13f54fa8a315471249a75a4c",
        mainAddress: "",
    },
    {
        name: "USDT",
        decimals: 6,
        explorerUrl: "https://mainnet.infura.io/v3/1c7781ad13f54fa8a315471249a75a4c",
        mainAddress: "0x36f4B7A8D3d9975AE4c00aD1b699cB0f6Dc20939",
    },
    {
        name: "YFI",
        decimals: 18,
        explorerUrl: "https://mainnet.infura.io/v3/1c7781ad13f54fa8a315471249a75a4c",
        mainAddress: "0x36f4B7A8D3d9975AE4c00aD1b699cB0f6Dc20939",
    },
];

const showERCBalanceToken = async function (addresses) {
    addresses.forEach((address) => {
        web3.eth.getBalance(address).then(console.log);
    });
}


main().then((addresses) => {
    showERCBalanceToken(addresses).then();
}).catch((err) => {
    console.log("First time setup failed.");
    console.error(err);
    MongoModels.disconnect();
    process.exit(1);
});
//
