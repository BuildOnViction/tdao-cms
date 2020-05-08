/**
*
* contract resource routing
*
*/

'use strict';

const Config = require('./contracts.config');

module.exports = (server, options) => [
  {
    method: 'GET',
    path: '/contracts',
    config: Config.find
  },
  {
    method: 'GET',
    path: '/contracts/{id}',
    config: Config.findOne
  },
  {
    method: 'POST',
    path: '/contracts',
    config: Config.create
  },
  {
    method: 'PUT',
    path: '/contracts/{id}',
    config: Config.edit
  },
  {
    method: 'DELETE',
    path: '/contracts/{id}',
    config: Config.destroy
  }
];
