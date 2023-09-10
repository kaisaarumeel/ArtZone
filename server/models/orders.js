const mongoose = require("mongoose");
//using the crypto module and the randomUUID() function we create unique order IDs
const { randomUUID } = require("crypto");

const orderSchema = new mongoose.Schema({ 
    seller: { type: String, required: true }, 
    orderId: { type: String, required: true, unique: true, sparse: true, 
        immutable: true, default: () => randomUUID() }, 
        listing: { type: String, required: true},
    isReceived: { type: Boolean, default: false } 
});

const OrderModel = new mongoose.model("Order", orderSchema);
module.exports = OrderModel;