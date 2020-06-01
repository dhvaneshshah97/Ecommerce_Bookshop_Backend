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
        // if no error, then we can go ahead and start creating a new product with fields we got
        let product = new Product(fields)

        // handling files
        if(files.photo) {
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