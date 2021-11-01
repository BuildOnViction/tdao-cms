'use strict';

const Sequelize = require('sequelize');
const decamelize = require('decamelize');
const config = require('../config');
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, config.mysql);
const users = require("./user")

sequelize.addHook('beforeDefine', (attributes) => {
  Object.keys(attributes).forEach((key) => {
    if (typeof attributes[key] !== 'function') {
      attributes[key].field = decamelize(key);
    }
  });
});

const db = {};

db["users"] = users;
db["token"] = token;

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
