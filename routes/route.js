const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/controller.js');
const { userSignupValidator } = require('../validator/index.js')

router.post('/signup', userSignupValidator ,signup);
router.post('/signin', signin);

module.exports = router;

