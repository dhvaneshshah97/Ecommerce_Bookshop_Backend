const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32,
    },
    category: {
        // IMO, whenever you make use of ref in your schema, you need to use objectID as your datatype property
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    quantity: {
        type: Number,
    },
    sold: {
        type: Number,
        default: 0,
    },
    photo: {
        // Buffer type is used when you usually work with items that get saved in binary form, a good example would be images.
        data: Buffer,
        contentType: String,    // Image.png, image.jpg etc.
    },
    shipping: {
        type: Boolean,
        required: false,
    },

}, {timestamps: true});
// creates a 'Product' named collection in ecommerce database
module.exports = mongoose.model("Product",productSchema);