'use strict';

const env = require('get-env')({
    qa: 'qa',
    dev: 'dev',
    production: 'production',
    staging: 'staging',
    test: 'test'
});

console.info('ENV ', env);
// this load the correct env config at runtime based on NODE_ENV
// defaults to 'dev'
module.exports = require(`./config/${env}`);
