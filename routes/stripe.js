const express = require('express');
const router = express.Router();
const stripe = require('stripe') (process.env.STRIPE_KEY);

router.post('/payment', (req, res, next) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    }, (stripeError, stripeResponse) => {
        if(stripeError) {
            res.status(500).send(stripeError);
        } else {
            res.status(200).send(stripeResponse);
        }
    })
})

module.exports = router;