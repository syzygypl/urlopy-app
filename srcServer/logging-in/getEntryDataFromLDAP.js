module.exports = (ldapClient, opts) =>
  new Promise((resolve, reject) => {
    ldapClient.search('dc=arsthanea,dc=com', opts, (err, res) => {
      res.on('searchEntry', (entry) => {
        resolve(entry.object);
      });

      res.on('end', (result) => {
        reject(result);
      });
    });
  });
