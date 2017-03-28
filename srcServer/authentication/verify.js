const nJwt = require('njwt');

const signingKey = require('./signingKey');

module.exports = token => new Promise((resolve, reject) => {
  nJwt.verify(token, signingKey, (err, verifiedJwt) => {
    if (err) {
      reject(err);
    } else {
      console.log(verifiedJwt.sub);

      resolve(verifiedJwt);
    }
  });
});
