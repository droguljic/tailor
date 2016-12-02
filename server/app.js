'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDefinition = require('../config/server/swagger');
const router = require('./router');
const logger = require('./logger');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Log all incoming requests.
app.use('/api/v1', (req, res, next) => {
  logger.info({ req });
  next();
});

// Mount the main router.
app.use('/api/v1', router);

// Global error handler.
app.use((err, req, res, next) => {
  logger.error({ err });

  // TODO(matej): validation errors should be handled by validation middleware.
  if (err.isJoi) {
    return res.status(400).json({
      error: {
        name: err.name,
        message: err.message
      }
    });
  }

  if (err.isArangoError) {
    // Treat '1202 - ERROR_ARANGO_DOCUMENT_NOT_FOUND' as '404 Not Found'.
    // https://docs.arangodb.com/3.0.10/Manual/Appendix/ErrorCodes.html
    if (err.errorNum === 1202) return res.status(404).json();

    // Don't leak error details in production.
    if (process.env.NODE_ENV === 'production') return res.status(500).json();

    // err.response is circular and cannot be serialized with res.json().
    delete err.response;
  }

  return res.status(500).json({
    error: {
      name: err.name,
      message: err.message,
      meta: err
    }
  });
});

// Serve swagger API spec in development environment.
if (process.env.NODE_ENV !== 'production') {
  const spec = swaggerJsDoc({
    swaggerDefinition,
    apis: ['./server/**/*.js']
  });

  app.get('/api/v1/swagger.json', (req, res, next) => res.status(200).json(spec));
}

// Handle non-existing routes.
app.use((req, res, next) => {
  res.status(404).json();
});

module.exports = app;