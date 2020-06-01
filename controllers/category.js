const Category = require('../models/category.js');
const { errorHandler } = require('../helpers/dbErrorHandler.js');

exports.create = (req, res) => {
    console.log(`Category created by user => ${req.body}`)
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                err
            });
        }
        res.json(data);
    });
}