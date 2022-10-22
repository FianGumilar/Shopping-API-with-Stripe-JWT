const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: {type: 'string', required: true},
        products: [
            {
                productId: {
                    type: String,
                },
                quantity: {type: 'number', default: 1}
            }
        ]
    },
    {timestamps: true}
)

module.exports = mongoose.model("Order", OrderSchema);