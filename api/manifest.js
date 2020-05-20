'use strict';
const Confidence = require('confidence');
const Config = require('./server/config');
const Path = require('path');

const criteria = {
    env: process.env.NODE_ENV
};

const manifest = {
    $meta: 'Manifest files',
    server: {
        app: Config,
        debug: {
            request: ['error']
        },
        routes: {
            security: true
        },
        port: Config.server.port,
        cache: [Config.cache.redis]
    },
    register: {
        plugins: [
            {
                plugin: 'good',
                options: {
                    reporters: {
                        myConsoleReporter: [
                            {
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{
                                    error: '*',
                                    log: '*',
                                    request: '*',
                                    response:'*'
                                }]
                            },
                            {
                                module: 'good-console',
                                args: [{
                                    color: {
                                        $filter: 'env',
                                        production: false,
                                        $default: true
                                    }
                                }]
                            },
                            'stdout'
                        ]
                    }
                }
            },
            {
                plugin: 'hapi-auth-jwt2'
            },
            {
                plugin: 'hapi-remote-address'
            },
            {
                plugin: 'inert'
            },
            {
                plugin: 'vision'
            },
            {
                plugin:'hapi-swagger',
                options: Config.swagger
            },
            // Find an elegant way to import the models
            {
                plugin: 'hapi-mongo-models',
                options: {
                    mongodb: Config.hapiMongoModels.mongodb,
                    models: [
                        Path.resolve(__dirname, './server/models/auth-attempt'),
                        Path.resolve(__dirname, './server/models/user'),
                        Path.resolve(__dirname, './server/models/token'),
                        Path.resolve(__dirname, './server/models/verification-phone-code'),
                        Path.resolve(__dirname, './server/models/job')
                    ],
                    autoIndex: Config.hapiMongoModels.autoIndex
                }
            },
            {
                plugin: require('hapi-mongoose'),
                options: {
                    promises: 'native',
                    uri: Config.hapiMongoModels.mongodb.connection.uri
                }
            },
            {
                plugin: './server/policies/httpResponse.js'
            },
            {
                plugin: './load-app-plugins.js'
            }
        ]
    }
};

const store = new Confidence.Store(manifest);

exports.get = function (key) {
    return store.get(key, criteria);
};

exports.meta = function (key) {
    return store.meta(key, criteria);
};
