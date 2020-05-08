/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const resourceExists = require('../utils/resourceExists');

module.exports = {
  description: 'Add an resource api CRUD',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Bob',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return resourceExists(value) ? 'A resource with this name already exists' : true;
      }

      return 'The name is required';
    },
  }],
  actions: (data) => {

    const actions = [{
      type: 'add',
      path: '../../server/routes/{{camelCase name}}s/{{camelCase name}}s.js',
      templateFile: './resource/index.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../server/routes/{{camelCase name}}s/{{camelCase name}}s.config.js',
      templateFile: './resource/config.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../server/routes/{{camelCase name}}s/{{camelCase name}}s.handlers.js',
      templateFile: './resource/handlers.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../../server/routes/{{camelCase name}}s/{{camelCase name}}s.validations.js',
      templateFile: './resource/validations.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../../server/methods/{{camelCase name}}s.js',
      templateFile: './resource/methods.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../../server/runtime/{{camelCase name}}s.js',
      templateFile: './resource/runtime.js.hbs',
      abortOnFail: true,
    },{
      type: 'add',
      path: '../../server/test/{{camelCase name}}s/index.js',
      templateFile: './resource/test.js.hbs',
      abortOnFail: true,
    }];

    return actions;
  },
};
