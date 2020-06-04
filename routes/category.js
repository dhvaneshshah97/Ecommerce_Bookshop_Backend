const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin  } = require('../controllers/auth.js');
const { create, categoryById, read } = require('../controllers/category.js');
const { userById } = require('../controllers/user.js');

router.get("/category/:categoryId", read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;

