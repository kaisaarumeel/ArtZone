const mongoose = require("mongoose");
const Orders = require("./orders");
const Listings = require("./listings");
const Reviews = require("./reviews")
const userSchema = new mongoose.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    address: {
        country: { type: String, required: true },
        street: { type: String, required: true },
        zip: { type: String, required: true },
        city: { type: String, required: true },
    },
    session: {
        key: { type: String, unique: true, sparse: true },
        expires: Number
    },
    dateOfBirth: { type: Date, required: true, immutable: true },
    password: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true, sparse: true },
    isAdmin: { type: Boolean, default: false, required: true },
    listings: [{ type: Listings.schema }],
    orders: [{ type: Orders.schema }],
    reviews: [{ type: Reviews.schema }]
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;