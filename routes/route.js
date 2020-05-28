const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');

router.post('/signup', controller.signup);

module.exports = router;
