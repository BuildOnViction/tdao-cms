'use strict';

const Chalk = require('chalk');
const Path = require('path');
const Fs = require('fs');
const _ = require('lodash');

const register = (server, options) => {
    // if (server.settings.app.env !== 'test') {
    console.log(Chalk.bgBlack.green('Registering authentication strategies...'));
    // }

    let strategies;

    _.each(Fs.readdirSync(Path.resolve(__dirname + '/strategies')), (filename) => {

        if (filename !== 'index.js') {
            strategies = require(`./strategies/${filename}`);
            strategies(server, options);
        }
    });
};

module.exports = {
    name: 'auth-strategies',
    dependencies: [
        'hapi-auth-jwt2'
    ],
    register
};
