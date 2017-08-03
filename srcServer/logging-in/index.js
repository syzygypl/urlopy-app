const router = require('express').Router();
const ldapLib = require('ldapjs');
const loginHandler = require('./loginHandler');

router.post('/login', loginHandler.bind(null, ldapLib));

module.exports = router;
