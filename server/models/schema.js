const mongoose = require("mongoose");
//using the crypto module and the randomUUID() function we create unique order IDs
const { randomUUID } = require("crypto");
// Variables

const user_schema = new mongoose.Schema({
    name: { firstName: { type: String, required: true }, lastName: { type: String, required: true }},
    address:{
        country:{ type: String, required: true },
        street:{ type: String, required: true },
        zip:{ type: String, required: true },
        city:{ type: String, required: true },
    },
    session: {
        key:{ type: String, unique: true,sparse:true },
        expires:Number
    },
    dateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    verificationStatus: { type: Boolean, default: false },
    userEmail: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false,required: true },

    listings: [ { name: { type: String, unique: true, required: true, sparse:true },
        author: { type: String, required: true }, 
        price: { type: Number, required: true },
        picture: { type: String, required: true, unique: true, sparse:true} } 
        ],

    orders: [ { seller: { type: String, required: true }, 
        orderId: { type: String, required: true, unique: true, sparse:true, 
            immutable: true, default: () => randomUUID() }, 
            listing: { type: String, required: true},
        isReceived: { type: Boolean, default: false } } 
        ]
});

const UserSchema = mongoose.model("user", user_schema);

module.exports = UserSchema;