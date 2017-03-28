const verify = require('./verify');

module.exports = (req, res, next) => {
  const token = req.body.token || '';

  verify(token)
    .then(() => next())
    .catch(() => res.send('Token not valid'));
};
