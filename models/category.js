const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true,
    },
}, {timestamps: true});
// creates a 'Category' named collection in ecommerce database
module.exports = mongoose.model("Category",categorySchema);