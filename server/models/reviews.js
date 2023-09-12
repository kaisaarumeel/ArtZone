const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
     description: { type: String, required: true }, 
     rating: { type: Number, required: true },
});

const ReviewModel = mongoose.model("Review", reviewSchema);
module.exports ={
     "model":ReviewModel,
     "schema":reviewSchema
}