const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin  } = require('../controllers/auth.js');
const { create, categoryById, read, remove } = require('../controllers/category.js');
const { userById } = require('../controllers/user.js');

router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/category/:categoryId", read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.param("userId", userById);
router.param("categoryId", categoryById);


module.exports = router;

