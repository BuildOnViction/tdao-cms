'use strict';
const Package = require('../../package.json');
const build = require('../runtime/build_version.json');

module.exports = {
    env: 'prod',
    product: {
        name: 'xkld',
        jwt: {
            key: 'RTGHJKL(*&RFCVBHJK'
        }
    },
    job_balance: {
        register_default_balance:500000,
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
            host: '127.0.0.1'
        }
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
        security: [{'jwt': []}],
        info: {
            title: 'API Documentation ' + build.version,
            version: Package.version,
            description: ``
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

    authAttempts: {
        forIp: 50,
        forIpAndUser: 7
    },
    hapiMongoModels: {
        mongodb: {
            connection: {
                uri: 'mongodb://localhost:27017/',
                db: 'xkld-info'
            }
        },
        autoIndex: true
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

    apiPrefix: '/api/v1'
};
