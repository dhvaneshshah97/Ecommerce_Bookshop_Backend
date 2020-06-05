const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin  } = require('../controllers/auth.js');
const { create, productById, read, remove, update, list, listRelated } = require('../controllers/product.js');
const { userById } = require('../controllers/user.js');

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);

// delete method is used to delete the product
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
//put method is used to update the product
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/products', list);
router.get('/products/related/:productId', listRelated);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;

