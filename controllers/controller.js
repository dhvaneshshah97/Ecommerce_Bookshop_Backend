const User = require('../models/user.js');
const { errorHandler } = require('../helpers/dbErrorHandler.js');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check

exports.signup = (req, res) => {
    console.log('req.body', req.body);
    // creates a new user
    const user = new User(req.body);
    // save created user to database
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err),
            });
        }
        user.salt = undefined
        user.hased_password = undefined
        res.json({
            user
        });
    });
}


exports.signin = (req, res) => {
    // find the user based on email

    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
        // if user not found then give json response with error message
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup",
            });
        }

        // if user is found make sure the email and password match

        // create authentic method in user model

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password do not match",
            });
        }

        // if user is authenticated then generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        //once we have our token, we want to persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });

        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({ message: "Signout success"});
}
