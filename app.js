const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphqlUploadExpress } = require('graphql-upload');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const schema = require('./modules');
const createSessionContext = require('./createSessionContext');

const app = express();
app.use(cors());
app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' }),
}));

app.use('/graphql', graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), graphqlHTTP(async (req) => {
  // create new context on every request
  const context = await createSessionContext(req, req.app.appContenxt);
  return {
    schema,
    graphiql: config.app.env === 'development',
    context,
  };
}));

module.exports = app;
