const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        title: {type: 'string',required: true, unique: true},
        desc: {type: 'string', required: true},
        img: {type: 'string', required: true},
        categories: {type: 'array'},
        size: {type: 'integer', required: true}, 
        color: {type: 'string', required: true},
        price: {type: 'number', require: true }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Product", ProductSchema);