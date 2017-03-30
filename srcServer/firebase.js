const firebase = require('firebase-admin');

const firebaseKeyPath = process.env.FIREBASE_PRIV_KEY_PATH;
const firebaseKey = require(`../${firebaseKeyPath}`); // eslint-disable-line import/no-dynamic-require

module.exports = firebase.initializeApp({
  credential: firebase.credential.cert(firebaseKey),
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
});
