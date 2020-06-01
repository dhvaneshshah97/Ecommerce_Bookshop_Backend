const express = require('express');
const router = express.Router();
const { userById } = require('../controllers/user.js');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth.js');

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json(req.profile);
});

// whenever this userId is in URL, below line will run and as a consequence, userById method will run, which stores current user(whose id is in URL bar) in req.profile object.
router.param("userId", userById);


module.exports = router;

