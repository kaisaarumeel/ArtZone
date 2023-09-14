const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const listingSchema = new mongoose.Schema({
     id: { type: String, required: true, unique: true, sparse: true, 
          immutable: true, default: () => randomUUID() }, 
     name: { type: String, required: true, sparse:true, minlength: 0,
          maxlength: 50 },
     author: { type: String, required: true }, 
     price: { type: Number, required: true, min: 0 },
     picture: { type: String, required: true, unique: true, sparse:true}
}, { _id: false });

const ListingModel = mongoose.model("Listing", listingSchema);
module.exports ={
     "model":ListingModel,
     "schema":listingSchema
}