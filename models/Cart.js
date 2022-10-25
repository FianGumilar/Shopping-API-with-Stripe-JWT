const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        userId: {type: 'string', required: true},
        products: [
            {
                productId: {
                    type: 'string',
                },
                quantity: {type: 'number', default: 1}
            }
        ],
        amount: {type: 'number', required: true},
        address: {type: 'object', required: true},
        status: {type: 'string', defaut: "pending"},
    },
    {timestamps: true}
)

module.exports = mongoose.model("Cart", CartSchema);