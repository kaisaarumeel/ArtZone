const OrderModel = require("../models/orders.js");
const UserModel = require("../models/user.js");
const { createHash, randomUUID } = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');

async function getUserByEmail(email,res){
    const user = await UserModel.findOne({ userEmail: email });
    if (!user) {
        res.status(404).json({ "message": "User was not found." });
        return;
    }
    return user;
}

async function validateEmail(email,res){
    //we use regx here to confirm that the email is of the right format.
    if (!email.match(/.*@.*/)) {
        res.status(400).json({ "message": "Invalid email provided" });
        return;
    }
    return email;
}


module.exports = {
    getUserByEmail, validateEmail
}