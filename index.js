const express = require('express');
const bodyParser = require('body-parser');

const { port } = require('./config');
const loggingInRouter = require('./srcServer/logging-in');

const app = express();

app.use(bodyParser.json());

app.use(loggingInRouter);

app.use(express.static(`${__dirname}/build`));

app.listen(port, () => console.log('Up and running...'));
