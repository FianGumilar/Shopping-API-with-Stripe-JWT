const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

//CREATE
router.post('/', verifyTokenAndAdmin, async (req, res, next) => {
    const newProduct = new Product(req.body);
    try {
        const savedUser = await newProduct.save();
        res.status(200).send(savedUser);
    } catch(err) {
        res.status(500).send(err);
    }
})

//GET ALL USERS
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

//GET BY ID
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch(err) {
        return res.status(404).send(err);
    }
});

//UPDATE
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

//DELETE
router.delete('/delete/:id', verifyTokenAndAdmin, async(req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted Product Successfuly!");
    } catch(err) {
        res.status(500).send(err);
    }
});

// router.get('/static', verifyTokenAndAdmin, async (req, res, next) => {
//     const date = new Date();
//     const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
//     try {
//       const data = await User.aggregate([
//         { $match: { createdAt: { $gte: lastYear } } },
//         {
//           $project: {
//             month: { $month: "$createdAt" },
//           },
//         },
//         {
//           $group: {
//             _id: "$month",
//             total: { $sum: 1 },
//           },
//         },
//       ]);
//       res.status(200).send(data);
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   });

module.exports = router;