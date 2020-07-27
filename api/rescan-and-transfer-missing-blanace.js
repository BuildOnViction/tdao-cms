"use strict";
const MongoModels = require("mongo-models");
const MongoClient = require("mongodb").MongoClient;
var Web3 = require("web3");
var web3 = new Web3(
    Web3.givenProvider ||
        "https://mainnet.infura.io/v3/1c7781ad13f54fa8a315471249a75a4c"
);
const main = async function () {
    let uri = "mongodb://localhost:27017/tomobridgejobs";
    let dbName = "tomobridgejobs";
    const client = await MongoClient.connect(uri, {});
    const db = client.db(dbName);
    const collection = db.collection("transactions");
    return new Promise((resolve, reject) => {
        collection
            .distinct("address", {
                "coin": {
                    $in: ["USDT", "ETH", "YFI"],
                },
            })
            .then(function (result) {
		console.log(result)
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
    const contract = new web3.eth.Contract(abi, "0xdac17f958d2ee523a2206206994597c13d831ec7");

    addresses.forEach((address) => {
	const balanceOfTx = contract.methods.balanceOf(address).call()
        .then(res => {
            console.log(address, res);
        });
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
