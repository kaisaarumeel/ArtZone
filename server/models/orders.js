const mongoose = require("mongoose");
//using the crypto module and the randomUUID() function we create unique order IDs
const { randomUUID } = require("crypto");

const orderSchema = new mongoose.Schema({
    seller: { type: String, required: true },
    buyer: { type: String, required: true },
    hash: { type: String, required: true, immutable: true },
    listing: { type: String, required: true, immutable: true },
    isReceived: { type: Boolean, default: false, required: true },
    isShipped: { type: Boolean, default: false, required: true },
    paypalOrderId: { type: Boolean, default: false, required: true },
});

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = {
    "schema": orderSchema,
    "model": OrderModel
};