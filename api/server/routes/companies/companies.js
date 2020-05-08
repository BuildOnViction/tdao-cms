/**
*
* company resource routing
*
*/

'use strict';

const Config = require('./companies.config');

module.exports = (server, options) => [
  {
    method: 'GET',
    path: '/companies',
    config: Config.find
  },
  {
    method: 'GET',
    path: '/companies/{id}',
    config: Config.findOne
  },
  {
    method: 'POST',
    path: '/companies',
    config: Config.create
  },
  {
    method: 'PUT',
    path: '/companies/{id}',
    config: Config.edit
  },
  {
    method: 'DELETE',
    path: '/companies/{id}',
    config: Config.destroy
  }
];
