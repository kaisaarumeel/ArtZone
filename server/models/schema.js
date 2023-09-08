const mongoose = require("mongoose");
//using the crypto module and the randomUUID() function we create unique order IDs
const { randomUUID } = require("crypto");

const artExchangeSchema = new mongoose.Schema({
    name: { firstName: String, lastName: String },
    dateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    varificationStatus: { type: Boolean, default: false },
    userEmail: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },

    artWorks: [ { name: { type: String, unique: true, required: true },
        author: { type: String, required: true }, 
        price: { type: Number, required: true },
        picture: { type: String, required: true, unique: true} } 
        ],

    orders: [ { seller: { type: String, required: true }, 
        orderId: { type: String, required: true, unique: true, 
            immutable: true, default: () => randomUUID() }, 
        artWork: { type: String, required: true},
        isRecieved: { type: Boolean, default: false } } 
        ]
});

const ArtExchange = mongoose.model("Art Exchange", artExchangeSchema);

module.exports = ArtExchange;