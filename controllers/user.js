const User = require('../models/user.js');

// This method will run whenever userId will be there in browser's URL bar.
exports.userById = (req, res, next, id) => {
    User.findById(id, (err, user) =>{
        if(err || !user) {
            res.status(400).json({
                error: "User not found"
            });
        }
        user.salt = undefined
        user.hashed_password = undefined
        user.createdAt = undefined
        user.updatedAt = undefined
        req.profile = user;
        next();
    });
};

exports.read = (req, res) => {
    res.json(req.profile);
};

exports.update = (req, res) => {
    User.findOneAndUpdate({_id: req.profile}, {$set : req.body},{new: true}, (err, user) => {
        if (err) {
            res.status(400).json({
                error: "You are not authorized to perform this action!",
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    });
    
}