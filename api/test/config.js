'use strict';
const Code = require('code');
const Config = require('../server/config');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

lab.experiment('Config', () => {
    lab.test('it gets config data', () => {
        Code.expect(Config).to.be.an.object();
    });
   
});
