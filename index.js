const express = require('express');
const app = express();
const { port } = require('./config');

app.use(express.static(__dirname + '/build'));

app.listen(port, () => console.log('Up and running...'));