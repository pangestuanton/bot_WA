const pino = require('pino');

function createLogger(config) {
  return pino({
    level: config.env === 'development' ? 'debug' : 'info'
  });
}

module.exports = { createLogger };
