/* eslint-disable no-console */
require('dotenv').config();
const cluster = require('cluster');
const os = require('os');
const app = require('./app');
const config = require('./config');
const bootstrapper = require('./bootstrapper');

function runApp() {
  bootstrapper().then((appContext) => {
    app.appContenxt = appContext;
    app.listen(config.app.port, () => {
      console.log(`Running a GraphQL API server at http://${config.app.host}:${config.app.port}/graphql`);
    });
  });
}

if (config.app.env === 'production') {
  if (cluster.isMaster) {
    os.cpus().forEach(cluster.fork);
  } else if (cluster.isWorker) {
    runApp();
  }
} else {
  runApp();
}
