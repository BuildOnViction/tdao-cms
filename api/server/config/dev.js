'use strict';
const Package = require('../../package.json');
const build = require('../runtime/build_version.json');

module.exports = {
    env: 'dev',
    product: {
        name: 'xkld',
        jwt: {
            key: 'RTGHJKL(*&RFCVBHJK'
        }
    },
    job_balance: {
        register_default_balance: 500000,
        jobs_default_balance: 20000
    },
    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 3333,
        tls: false
    },

    chairo: {
        options: {
            // prevent seneca timeout error
            // https://github.com/senecajs/seneca-transport/issues/23
            timeout: 999999999
        }
    },

    cache: {
        redis: {
            engine: require('catbox-redis'),
            name: 'redis',
            partition: 'user-authen',
            host: '127.0.0.1',
            database: 0
        }
    },

    authAttempts: {
        forIp: 50,
        forIpAndUser: 4
    },

    remotePubsub: {
        projectId: 'tomobridge',
        topic: 'bridge'
    },

    hapiMongoModels: {
        mongodb: {
            connection: {
                uri: 'mongodb://localhost:27017/tomobridgecms',
                db: 'tomobridgecms',
            }
        },
        autoIndex: true
    },

    swagger: {
        // host: 'localhost',
        // schemes: ['https'],
        securityDefinitions: {
            'jwt': {
                'type': 'apiKey',
                'name': 'Authorization',
                'in': 'header'
            }
        },
        security: [{ 'jwt': [] }],
        info: {
            title: 'API Documentation ' + build.version,
            version: Package.version,
            description: ` Bla bla`
        },
        grouping: 'tags',
        sortTags: 'name',
        tags: [
            {
                name: 'login',
                description: 'endpoints for login flow.'
            }, {
                name: 'users',
                description: 'endpoints to interact with users (outside of roles)'
            }, {
                name: 'order',
                description: 'endpoints to interact with orders'
            }
        ]
    },

    nodemailer: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'tuananh@hottab.net',
            pass: process.env.SMTP_PASSWORD
        }
    },

    sms: {
        accountSid: 'AC1549f310d76162cc3b01f8c0d1ba1a55',
        authToken: '3a01821db50a80c2f3a631f634d50623',
        from: '+13343846492'
    },

    apiPrefix: '/api/v1',
    onepayDom: {
        paymentGateway: 'https://mtf.onepay.vn/onecomm-pay/vpc.op',
        merchant: 'ONEPAY',
        accessCode: 'D67342C2',
        secureSecret: 'A3EFDFABA8653DF2342E8DAC29B51AF0',
    },
    tasksUri: {
        "wallet": {
            uri: "mongodb://localhost:27017/gpcwalletlocal",
            dbName: "gpcwalletlocal",
        },
        "proxy": {
            uri: "mongodb://localhost:27017/gpcqueuejobs",
            dbName: "gpcqueuejobs",
        },
        "master": {
            uri: "mongodb://localhost:27017/gpcqueuejobs",
            dbName: "gpcqueuejobs",
        },
        "verifier": {
            uri: "mongodb://localhost:27017/gpcqueuejobs",
            dbName: "gpcqueuejobs",
        },
        "api": {
            uri: "mongodb://206.189.39.242:27017/",
            dbName: "machinery_api",
        },
    },
    transactionUri: {
        "wallet": {
            uri: "mongodb://localhost:27017/gpcwalletlocal",
            dbName: "gpcwalletlocal",
        },
        "proxy": {
            uri: "mongodb://localhost:27017/gpcqueuejobs",
            dbName: "gpcqueuejobs",
        },
        "master": {
            uri: "mongodb://localhost:27017/gpcqueuejobs",
            dbName: "gpcqueuejobs",
        },
        "verifier": {
            uri: "mongodb://localhost:27017/gpcqueuejobs",
            dbName: "gpcqueuejobs",
        },
        "api": {
            uri: "mongodb://mongodb:27017/tomobridgecms",
            dbName: "tomobridgecms",
        },
    }
};
