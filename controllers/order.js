const {Order, CartItem} = require('../models/order');


exports.create = (req, res) => {
    // console.log("Create order", req.body);
    req.body.order.user = req.profile
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: error,
            });
        }
        res.json(data);
    })


    // we have to return something, so that execution does not halt at await and code after await works.
    return res.json({});
}