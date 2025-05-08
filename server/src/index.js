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
    if (process.env.CI !== 'true') { // Only attempt DB connection if not in CI
      await db.sequelize.authenticate();
      logger.info('Database connection has been established successfully.');
      await db.sequelize.sync({ force: false }); // Make sync awaitable too
      logger.info('Database synchronized.');
    } else {
      logger.warn('CI environment detected. Skipping database connection and sync.');
    }
  } catch (error) {
    logger.error('Database operation failed:');
    console.error("Detailed connection error object:", error);
    logger.error('Exiting due to database connection failure in non-CI environment.');
    if (process.env.NODE_ENV !== 'ci' && process.env.CI !== 'true') {
      process.exit(1);
    }
    // In CI, log the error but proceed to start the server
    logger.warn('Proceeding to start server in CI despite database error.');
  }

  // Always try to start the server
  app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
    if (process.env.CI === 'true') {
        logger.info('Server started in CI mode (database operations might be skipped/mocked).');
    }
  }).on('error', (err) => {
    logger.error('Failed to start server:', err);
    process.exit(1); // Exit if server itself can't start (e.g., port in use)
  });
};

startServer();
