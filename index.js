const express = require('express');
const bodyParser = require('body-parser');

const { port } = require('./config');
const auth = require('./srcServer/authentication/auth');
const loggingInRouter = require('./srcServer/logging-in');

const app = express();

app.use(bodyParser.json());

app.use(loggingInRouter);

app.post('/someSecretIsKeptHere', auth, (req, res) => {
  res.send('You now know the secret! :>');
});

app.use(express.static(`${__dirname}/build`));

app.listen(port, () => console.log('Up and running...'));
