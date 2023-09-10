const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    cardNumber: { type: Number, unique: true, required, sparse: true},
    cvv: { type: Number, required: true},
    expiry: { type: Date, required: true},
});

const CardModel = mongoose.Model("Card", cardSchema);
module.exports = CardModel;