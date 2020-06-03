const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin  } = require('../controllers/auth.js');
const { create, productById, read, remove, update } = require('../controllers/product.js');
const { userById } = require('../controllers/user.js');

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
//put method is used to update the product
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);


router.param("userId", userById);
router.param("productId", productById);

module.exports = router;

