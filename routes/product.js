const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

//CREATE PRODUCT
router.post('/', verifyTokenAndAdmin, async (req, res, next) => {
    const newProduct = new Product(req.body);
    try {
        const savedUser = await newProduct.save();
        res.status(200).send(savedUser);
    } catch(err) {
        res.status(500).send(err);
    }
})

//GET ALL USER RODUCTS
router.get('/', async(req, res, next) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;

        if(qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1)
        } else if(qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }
        res.status(200).send(products);
    } catch(err) {
        res.status(500).send(err);
    }

})

//GET PRODUCT BY ID
router.get('/:userId', async (req, res, next) => {
    try {
        const products = await Product.findOne({ userId: req.params.userId});
        res.status(200).json(products);
    } catch(err) {
        return res.status(404).send(err);
    }
});

//UPDATE PRODUCT
router.patch('/update/:id', verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        { new: true});
        res.status(200).send(updatedProduct);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//DELETE PRODUCT
router.delete('/delete/:id', verifyTokenAndAdmin, async(req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted Product Successfuly!");
    } catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router;