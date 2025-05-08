require('dotenv').config();
const express = require('express');
const db = require('./models');
const logger = require('./config/logger'); // Import Winston logger
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig'); // Import Swagger Spec
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
app.use(helmet()); // Use helmet to set various security headers
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic rate limiting to all API routes
// Customize as needed, e.g., for specific routes or more complex scenarios
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', apiLimiter); // Apply to all routes starting with /api

app.get('/', (req, res) => {
  logger.info('Root endpoint hit');
  res.send('Welcome to AIDataVault Server!');
});

// Mount auth routes
app.use('/api/auth', authRoutes);
// Mount user routes
app.use('/api/users', userRoutes);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    db.sequelize.sync({ force: false }) 
  .then(() => {
    logger.info('Database synchronized.');
    app.listen(PORT, () => {
      logger.info(`Server is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Failed to sync database:', err);
  });
  } catch (error) {
    logger.error('Unable to connect to the database or start server:', error);
    process.exit(1);
  }
};

startServer();
