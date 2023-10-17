const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const listingSchema = new mongoose.Schema({
     name: {
          type: String, required: true, minlength: 0,
          maxlength: 50
     },
     author: { type: String, required: true },
     price: { type: Number, required: true, min: 1 },
     picture: { type: String, required: true },
     description: {
          type: String, minlength: 0,
          maxlength: 1000
     },
     creator: { type: String, required: true },
     sold: { type: Boolean, required: true }
});

const ListingModel = mongoose.model("Listing", listingSchema);
module.exports = {
     "model": ListingModel,
     "schema": listingSchema
}