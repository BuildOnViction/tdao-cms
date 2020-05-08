'use strict';

let prefix = require('./server/config').apiPrefix;

const register = async (server, options) => {
    await server.register([
        // {
        //     plugin: require('./server/runtime')
        // },
        {
            plugin: require('./server/auth')
        },
        {
            plugin: require('./server/methods')
        },
        {
            plugin: require('./server/routes'),
            options: { prefix }
        },
        // {
        //     plugin: require('./server/jobs')
        // },
        // {
        //     plugin: require('./server/plugins/shutdown')
        // }
    ]);
};

module.exports = {
    name: 'load-application-modules',
    register
};
