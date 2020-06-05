// to handle image upload, we can use formidable package
// formidable - Node.js module for parsing form data, especially file uploads. 
const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/product.js');
const fs = require('fs');

exports.productById = (req,res,next,id) => {
    Product.findById(id , (err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: "Product not found!",
            });
        }

        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm(); // all the form data will be available from this IncomingForm
    form.keepExtensions = true // whatever image type we will be getting, the extensions will be there.
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }
        //check for all fields
        const { name, description, price, quantity, shipping, category } = fields
        if (!name || !description || !price || !quantity || !category || !shipping) {
            return res.status(400).json({
                error: "All fields are required!",
            });
        }
        // if no error, then we can go ahead and start creating a new product with fields we got
        let product = new Product(fields)

        // 1kb = 1000
        // 1mb = 1000000

        // handling files
        if (files.photo) {
            console.log('File photo: ', files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size",
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    err
                });
            }
            res.json(result);
        })

    });
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                err,
            });
        }
        res.json({
            message: "Product deleted successfully",
        }); 
    })
}


exports.update = (req, res) => {
    let form = new formidable.IncomingForm(); // all the form data will be available from this IncomingForm
    form.keepExtensions = true // whatever image type we will be getting, the extensions will be there.
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }
        //check for all fields
        // const { name, description, price, quantity, shipping, category } = fields
        // if (!name || !description || !price || !quantity || !category || !shipping) {
        //     return res.status(400).json({
        //         error: "All fields are required!",
        //     });
        // }
        // Now, we have changes, so we need to replace the existing information with new information, for that we will use extend method of lodash library
        let product = req.product
        // extend method takes 2 arguments, first it takes product and then changes
        product = _.extend(product, fields)

        // 1kb = 1000
        // 1mb = 1000000

        // handling files
        if (files.photo) {
            console.log('File photo: ', files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size",
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    err
                });
            }
            res.json({
                message: "Product Updated Successfully",
            });
        })

    });
};


/*
    * return products by sell / arrival
    * if we want to return product by sell or arrival, we need query parameters something like this, 
    * by sell = /products?sortBy=sold&order=desc&limit=4
    * by arrival = /products?sortBy=createdAt&order=desc&limit=4
    * if no params are sent, then all products are returned
*/

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6; // here we are fetching limit from URL, so it will be fetched in string format and we need to give this value to database, so we have to make it into an integer, that's why we used parsedInt.

    Product.find()
        .select("-photo") // we will make another request to fetch photo for the product, for now we will not sending photo field because if we do so, our response will be slow
        .populate('category') // not sure about this
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found",
                });
            }
            res.send(products);
        });
};
