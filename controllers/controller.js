const User = require('../models/user.js');

const signup = (req, res) => {
    console.log('req.body', req.body);
    // creates a new user
    const user = new User(req.body);
    // save created user to database
    user.save( (err, user) => { 
        if (err) {
            return res.status(400).json({
                err
            });
        }
        res.json({
            user
        })
    });
}

module.exports = { signup };