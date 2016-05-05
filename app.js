'use strict';
let cluster = require('cluster');
let os = require('os');
let logger = require('./modules/alice-logger');

if (cluster.isMaster) {
  let workersCount = os.cpus().length;
  logger.info(`Master setting up ${workersCount} workers...`);

  for (let i = 0; i < workersCount; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    logger.info(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} died with code ${code}, and signal ${signal}`);
    logger.info('Starting a new worker');
    cluster.fork();
  });
} else {
  require('./server');
}
