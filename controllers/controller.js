const User = require('../models/user.js');
const { errorHandler } = require('../helpers/dbErrorHandler.js');

exports.signup = (req, res) => {
    console.log('req.body', req.body);
    // creates a new user
    const user = new User(req.body);
    // save created user to database
    user.save( (err, user) => { 
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

// module.exports = { signup };