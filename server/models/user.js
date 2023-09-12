const mongoose = require("mongoose");
const Listings=require("./listings");
const userSchema = new mongoose.Schema({
    name: { 
        firstName: { type: String, required: true }, 
        lastName: { type: String, required: true } 
    },
    address:{
        country:{ type: String, required: true },
        street:{ type: String, required: true },
        zip:{ type: String, required: true },
        city:{ type: String, required: true },
    },
    session: {
        key:{ type: String, unique: true, sparse: true },
        expires: Number
    },
    dateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    verificationStatus: { type: Boolean, default: false },
    userEmail: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false,required: true },
    listings: [ { type:Listings.schema} ],
    orders: [ { type: mongoose.Schema.Types.ObjectId, ref: "Order" } ],
    card: [ { type: mongoose.Schema.Types.ObjectId, ref: "Card" } ]
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;