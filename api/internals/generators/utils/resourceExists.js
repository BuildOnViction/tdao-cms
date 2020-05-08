/**
 * resourceExists
 *
 * Check whether the given resource exist in either the routes or methods or runtime_configs directory
 */

const fs = require('fs');
const path = require('path');
const resourceRoutes = fs.readdirSync(path.join(__dirname, '../../../server/routes'));
const resourceMethods = fs.readdirSync(path.join(__dirname, '../../../server/methods'));
const resourceConfigs = fs.readdirSync(path.join(__dirname, '../../../server/runtime'));
const resources = resourceRoutes.concat(resourceMethods).concat(resourceConfigs);

function resourceExists(comp) {
  return resources.indexOf(comp) >= 0;
}

module.exports = resourceExists;
