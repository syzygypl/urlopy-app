const compose = require('../common').compose;
const express = require('express');
const fs = require('fs');
const app = express();

const getPort = compose(
  port => port[0],
  splitted => splitted.slice(-1),
  proxy => proxy.split(':'),
  parsed => parsed.proxy,
  JSON.parse,
  file => file.toString(),
  fs.readFileSync
);

app.use(express.static(__dirname + '/public'));

app.get('/res', (req, res) => res.send('OK!'));

app.listen(
  getPort('../client/package.json'),
  () => console.log('Up and running...')
);