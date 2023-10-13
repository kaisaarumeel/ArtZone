const OrderModel = require("../models/orders.js");
const UserModel = require("../models/user.js");
const { createHash, randomUUID } = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');

async function getUserByEmail(email,res){
    const user = await UserModel.findOne({ userEmail: email });
    if (!user) {
        throw new Error("User was not found");
    }
    return user.toObject();
}

async function validateEmail(email,res){
    //we use regx here to confirm that the email is of the right format.
    if (!email.match(/.*@.*/)) {
        throw new Error("Invalid email")
    }
    return email;
}


module.exports = {
    getUserByEmail, validateEmail
}