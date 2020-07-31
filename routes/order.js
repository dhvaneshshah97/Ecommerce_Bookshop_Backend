const express = require('express');
const router = express.Router();
const { requireSignin, isAuth } = require('../controllers/auth.js');
const { userById } = require('../controllers/user.js');
const { create } = require('../controllers/order.js');

router.post("/order/create/:userId", requireSignin, isAuth, create);

router.param("userId", userById);

module.exports = router;