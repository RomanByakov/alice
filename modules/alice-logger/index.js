var winston = require('winston');

module.exports = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      level: 'debug'
    }),
    new (winston.transports.File)({
      name: 'info-file',
      level: 'info',
      silent: false,
      maxsize: 1048576,
      filename: 'logs/info.log'
    }),
    new (winston.transports.File)({
      name: 'debug-file',
      level: 'debug',
      colorize: true,
      silent: false,
      maxsize: 1048576,
      filename: 'logs/debug.log'
    }),
    new (winston.transports.File)({
      name: 'warning-file',
      level: 'warn',
      silent: false,
      maxsize: 1048576,
      filename: 'logs/warning.log'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      level: 'error',
      silent: false,
      maxsize: 1048576,
      filename: 'logs/error.log'
    })
  ]
});
