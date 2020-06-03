// to handle image upload, we can use formidable package
// formidable - Node.js module for parsing form data, especially file uploads. 
const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/product.js');
const fs = require('fs');

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