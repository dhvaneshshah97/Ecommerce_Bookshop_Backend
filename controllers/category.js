const Category = require('../models/category.js');
// const { errorHandler } = require('../helpers/dbErrorHandler.js');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id, (err, category) => {
        if (err || !category){
            return res.status(400).json({
                error: "Category does not exist!"
            });
        }
        req.category = category;
        next();     
    })
}

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

exports.read = (req, res) => {
    return res.json(req.category);
}

exports.remove = (req, res) => {
    let category = req.category;
    category.remove((err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                err,
            });
        }
        res.json({
            message: "Category deleted successfully",
        }); 
    });
}