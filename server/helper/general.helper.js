const UserModel = require("../models/user.js");

async function getUserByEmail(email) {
    const user = await UserModel.findOne({ userEmail: email });
    if (!user) {
        throw new Error("User was not found");
    }
    return user
}

async function validateEmail(email) {
    //we use regx here to confirm that the email is of the right format.
    if (!email.match(/.*@.*/)) {
        throw new Error("Invalid email")
    }
    return email;
}

module.exports = {
    getUserByEmail, validateEmail
}