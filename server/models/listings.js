const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
     name: { type: String, unique: true, 
          required: true, sparse:true, minlength: 0,
          maxlength: 50 },
     author: { type: String, required: true }, 
     price: { type: Number, required: true, min: 0 },
     picture: { type: String, required: true, unique: true, sparse:true},
     description: { type: String, required: true} 
});

const ListingModel = new mongoose.model("Listing", listingSchema);
module.exports = ListingModel;