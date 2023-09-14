const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
     description: { type: String, required: true, minlength: 0,
          maxlength: 200}, 
     rating: { type: Number, required: true, min: 0 , max: 5 },
});

const ReviewModel = mongoose.model("Review", reviewSchema);
module.exports ={
     "model":ReviewModel,
     "schema":reviewSchema
}