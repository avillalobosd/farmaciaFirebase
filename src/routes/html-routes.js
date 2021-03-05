const express = require('express');
const router = express.Router();

const apiroutes = require('api-routes');

router.get('/users', apiroutes.test);

module.exports = router;