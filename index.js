const express = require('express');
const { port } = require('./config');

const app = express();

app.use(express.static(`${__dirname}/build`));

app.listen(port, () => console.log('Up and running...'));
