const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
     name: { type: String, required: true, sparse:true, minlength: 0,
          maxlength: 50 },
     author: { type: String, required: true }, 
     price: { type: Number, required: true, min: 0 },
     picture: { type: String, required: true, unique: true, sparse:true}
});

const ListingModel = mongoose.model("Listing", listingSchema);
module.exports ={
     "model":ListingModel,
     "schema":listingSchema
}