'use strict';

const Chalk = require('chalk');
const Path = require('path');
const Fs = require('fs');
const _ = require('lodash');

const register = (server, options) => {

    if (server.settings.app.env !== 'test') {
        console.log(Chalk.bgBlack.green('Loading server methods...'));
    }

    let methods;

    _.each(Fs.readdirSync(Path.resolve(__dirname)), (filename) => {

        if (filename !== 'index.js') {
            methods = require(`./${filename}`);
            server.method(methods(server, options));
        }
    });

};

module.exports = {
    name: 'methods-plugin',
    register
};
