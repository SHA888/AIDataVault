const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AIDataVault API',
      version: '1.0.0',
      description: 'API documentation for the AIDataVault backend services.',
      contact: {
        name: 'Your Name/Team', // Optional
        // url: 'your-website.com', // Optional
        // email: 'your-email@example.com', // Optional
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}/api`, // Adjust if your API base path is different
        description: 'Development server',
      },
      // You can add more servers here (e.g., staging, production)
    ],
    components: { // Global components like security schemes
      securitySchemes: {
        bearerAuth: { // Arbitrary name for the scheme
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, for documentation purposes
        },
      },
    },
    // security: [ // Apply security globally, or specify per-path/operation
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  // Path to the API docs
  // Looks for JSDoc comments in all .js files in the routes directory
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
