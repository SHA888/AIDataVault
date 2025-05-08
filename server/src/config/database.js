const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure environment variables are loaded

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log, // Or false to disable logging, or a custom function
    // dialectOptions: {
    //   ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    // },
  });
} else {
  sequelize = new Sequelize(
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
}

module.exports = sequelize;
