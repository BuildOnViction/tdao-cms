'use strict';

const Chalk = require('chalk');
const Path = require('path');
const Fs = require('fs');
const _ = require('lodash');
let prefix = require('../config').apiPrefix;

const register = (server, options) => {
    let routes;
    server.realm.modifiers.route.prefix = prefix;

    _.each(Fs.readdirSync(Path.resolve(__dirname)), (filename) => {
        const toExclude = /config|handlers|validations|index|examples|.DS_Store/;
        if (!toExclude.test(filename)) {
            routes = require(`./${filename}/${filename}`);
            server.route(routes(server, options));
        }
    });
};

module.exports = {
    name: 'routes-plugin',
    // dependencies: [
    //     'hapi-auth-bearer-token'
    // ],
    register
};
