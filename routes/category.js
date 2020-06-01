const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin  } = require('../controllers/auth.js');
const { create } = require('../controllers/category.js');
const { userById } = require('../controllers/user.js');

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.param("userId", userById);

module.exports = router;

