module.exports = (client, dn, password) => new Promise((res, rej) => {
  client.bind(dn, password, (err) => {
    if (err) {
      rej({ err, client });
    } else {
      res({ err: null, client });
    }
  });
});
