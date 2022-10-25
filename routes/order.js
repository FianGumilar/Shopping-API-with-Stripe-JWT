const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require('./verifyToken');

//CREATE
router.post('/', verifyTokenAndAuthorization, async (req, res, next) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).send(savedOrder);
    } catch(err) {
        res.status(500).send(err);
    }
})

//GET ALL USERS
router.get('/', verifyTokenAndAdmin, async(req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).send(orders);
    } catch(err) {
        return res.status(500).send(err);
    }
})

//GET BY ID
router.get('/:id', verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const orders = await Order.findById(req.params.id);
        res.status(200).json(orders);
    } catch(err) {
        return res.status(404).send(err);
    }
});

//UPDATE
router.patch('/update/:id', verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        { new: true});
        res.status(200).send(updatedOrder);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//DELETE
router.delete('/delete/:id', verifyTokenAndAdmin, async(req, res, next) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted Order Successfuly!");
    } catch(err) {
        res.status(500).send(err);
    }
});

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
        const date = new Date();
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
      
        try {
          const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
              $project: {
                month: { $month: "$createdAt" },
                sales: "$amount",
              },
            },
            {
              $group: {
                _id: "$month",
                total: { $sum: "$sales" },
              },
            },
          ]);
          res.status(200).send(income);
        } catch (err) {
          res.status(500).send(err);
        }
    });

module.exports = router;