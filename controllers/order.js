const { Order, CartItem } = require('../models/order');

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if (err || !order) {
                res.status(400).json({
                    error: err,
                });
            }

            req.order = order;
            next();
        })
}

exports.create = (req, res) => {
    // console.log("Create order", req.body.order.products);
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
}

exports.listOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .sort("-created")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: error,
                });
            }
            res.json(orders);
        })
}

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
}

exports.updateOrderStatus = (req, res) => {
    Order.updateOne({_id: req.body.orderId}, {$set: {status: req.body.status}}, () => {
        (err, order) => {
            if (err) {
                res.status(400).json({
                    error: err,
                }); 
            }
        }
        res.json({});
    }); 
}