var Sequelize = require('sequelize');
var config    = require(__dirname + '/config.json')["development"];


module.exports = new Sequelize(config.database, config.username, config.password, config);