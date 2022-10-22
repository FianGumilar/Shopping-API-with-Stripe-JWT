require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');

router.post('/register', async(req, res, next) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PAS_SEC),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch(err) {
        return res.status(500).send(err);
    }
});

//LOGIN
router.post('/login', async(req,res,next) => {
    try {
        const user = await User.findOne({ username: req.body.username});
            !user && res.status(404).send("Wrong Credentials!");
    
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PAS_SEC);

        const password = hashedPassword.toString(CryptoJS.enc.Utf8);
            password !== req.body.password && res.status(401).send("Wrong Credentials!");

        res.status(200).send(user);
    } catch(err) {
        res.status(500).send(err);
    }

})


module.exports = router;