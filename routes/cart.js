const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require('./verifyToken');

//CREATE CART USERS
router.post('/', verifyToken, async (req, res, next) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).send(savedCart);
    } catch(err) {
        res.status(500).send(err);
    }
})

//GET ALL CART USERS
router.get('/', verifyTokenAndAdmin, async(req, res, next) => {
    try {
        const carts = await Cart.find();
        res.status(200).send(carts);
    } catch(err) {
        return res.status(500).send(err);
    }
})

//GET BY ID
router.get('/:id', verifyToken, async (req, res, next) => {
    try {
        const cart = await Cart.findById(req.params.id);
        res.status(200).json(cart);
    } catch(err) {
        return res.status(404).send(err);
    }
});

//UPDATE
router.patch('/update/:id', verifyTokenAndAuthorization, async (req, res, next) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        { new: true});
        res.status(200).send(updatedCart);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//DELETE
router.delete('/delete/:id', verifyTokenAndAuthorization, async(req, res, next) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted Cart Successfuly!");
    } catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router;