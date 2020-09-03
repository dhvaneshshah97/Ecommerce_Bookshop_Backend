const User = require('../models/user.js');
const { Order } = require('../models/order');

// This method will run whenever userId will be there in browser's URL bar.
exports.userById = (req, res, next, id) => {
    User.findById(id, (err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: "User not found"
            });
        }
        // user.salt = 'undefined'
        // user.hashed_password = 'undefined'
        // user.createdAt = 'undefined'
        // user.updatedAt = 'undefined'
        req.profile = user;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    res.json(req.profile);

};

exports.update = (req, res) => {
    //  By default, findOneAndUpdate() returns the document as it was before update was applied. So, You should set the new option to true to return the document after update was applied.
    User.findOneAndUpdate({ _id: req.profile }, { $set: req.body }, { new: true }, (err, user) => {
        const { password } = req.body;
        if (err) {
            res.status(400).json({
                error: "You are not authorized to perform this action!",
            });
        }
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: "password should be min 6 characters long",
                })
            } else {
                user.password = password;
            }
        }
        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        })
        // user.hashed_password = undefined;
        // user.salt = undefined;
        // res.json(user);
    });

}

exports.addOrderToUserHistory = (req, res, next) => {
    let history = []

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category.name,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount,
        });
    })

    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true },
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update user purchase history"
                });
            }
            next();
        }
    )
}

exports.purchaseHistory = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate('user', '_id name')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            res.json(orders);
        });
}