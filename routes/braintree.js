const express = require('express');
const router = express.Router();
const { requireSignin, isAuth } = require('../controllers/auth.js');
const { userById } = require('../controllers/user.js');
const { generateToken } = require('../controllers/braintree.js');


router.get('/braintree/getToken/:userId', requireSignin, isAuth, generateToken);

router.param("userId", userById);

module.exports = router;