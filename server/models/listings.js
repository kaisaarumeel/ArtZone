const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
     name: { type: String, unique: true, required: true, sparse:true },
     author: { type: String, required: true }, 
     price: { type: Number, required: true },
     picture: { type: String, required: true, unique: true, sparse:true} 
});

const ListingModel = new mongoose.model("Listing", listingSchema);
module.exports = ListingModel;