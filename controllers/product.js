// to handle image upload, we can use formidable package
// formidable - Node.js module for parsing form data, especially file uploads. 
const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/product.js');
const fs = require('fs');

exports.productById = (req, res, next, id) => {
    // I want to show the category name on 'Product' component(View Product-single product component), so that's why I need to populate the category here below
    Product.findById(id).populate('category').exec((err, product) => {
        if (err || !product) {
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
    let limit = req.query.limit ? parseInt(req.query.limit) : 10; // here we are fetching limit from URL, so it will be fetched in string format and we need to give this value to database, so we have to make it into an integer, that's why we used parsedInt.

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
            res.json(products);
        });
};

// it will find the products based on the req product category, other products that has same cateogry will be returned 

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .select("-photo")
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No related products found!",
                });
            }
            res.json(products);
        });
}

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "No related products found!",
            });
        }
        res.json(categories);
    });
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    console.log(findArgs);

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {}
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' } // i is for case-insensitivity, does not matter for caps or lower case // regex is built-in pattern matching used by mongoose
    }
    // assign category value to query.category
    if (req.query.category && req.query.category != 'All') {
        query.category = req.query.category;
    }
    if (query.name || query.category) {
        // find the product based on query object with 2 properties 'search' and 'category'
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: err,
                });
            }
            res.json(products);
        }).select('-photo');
    }

}

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    })

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: "Could not update product"
            });
        }
        next();
    });
}