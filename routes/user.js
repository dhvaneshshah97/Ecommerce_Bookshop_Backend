const express = require('express');
const router = express.Router();
const { userById } = require('../controllers/user.js');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth.js');

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json(req.profile);
});
router.param("userId", userById);


module.exports = router;

