const sequelize = require('../config/database');
const UserDefinition = require('./user');

const db = {};

db.sequelize = sequelize; // The Sequelize instance
db.Sequelize = require('sequelize'); // The Sequelize library itself (for DataTypes, Op, etc.)

// Initialize models
db.User = UserDefinition(sequelize);

// If you have associations, define them here
// e.g., db.User.hasMany(db.Post);

module.exports = db;
