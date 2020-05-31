const User = require('../models/userModel.js');

exports.userById = (req, res, next, id) => {
    User.findById(id, (err, user) =>{
        if(err || !user) {
            res.status(400).json({
                error: "User not found"
            });
        }
        user.salt = undefined
        user.hased_password = undefined
        user.createdAt = undefined
        user.updatedAt = undefined
        req.profile = user;
        next();
    });
};
