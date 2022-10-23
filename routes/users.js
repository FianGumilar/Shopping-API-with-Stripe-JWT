const express = require('express');
const router = express.Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');
const User = require('../models/User');
const { Router } = require('express');

//GET ALL USERS
router.get('/', verifyTokenAndAdmin, async (req, res, next) =>{
    try {
        const user = await User.find();
        res.status(200).send(user);
    } catch(err) {
        return res.status(404).send(err);
    }
})

//GET BY ID
router.get('/:id', verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;  
        res.status(200).json(others);
    } catch(err) {
        return res.status(404).send(err);
    }
})

//UPDATE
router.patch('/update/:id', verifyTokenAndAuthorization, async (req, res, next) => {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PAS_SEC).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        { new: true});
        res.status(200).send(updatedUser);
    } catch (err) {
        return res.status(500).send(err);
    }
})

//DELETE
router.delete('/delete/:id', verifyTokenAndAuthorization, async(req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted Successfuly!");
    } catch(err) {
        res.status(500).send(err);
    }
})

module.exports = router;
