const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure environment variables are loaded

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log, // Or false to disable logging, or a custom function
    // dialectOptions: {
    //   ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    // },
  }
);

module.exports = sequelize;
