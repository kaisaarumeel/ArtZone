const express = require('express');
const router = express.Router({mergeParams:true});
const User = require('../models/user.js'); 
const Review = require('../models/reviews.js').model

// GET /reviews - Gets all reviews from all users
router.get('/', async (req, res) => {
  try {
    // Find all users
    const users = await User.find();
    if (!users) return res.status(200).json({"message": "no users are in the system."});

       const reviews = users.flatMap((user) => user.reviews.map((review) => ({
      description: review.description,
      rating: review.rating,
      _id: review._id,
      userEmail: user.userEmail // Add userEmail to the review
    })));

 
    if (!reviews || reviews.length === 0) return res.status(200).json({"message": "no reviews are saved in the system."});

    res.status(200).json({
      reviews
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete('/', async (req, res) => {
  if(!req.auth.isAdmin) return res.sendStatus(403);
  try {
    // Delete all reviews from the database
    const result = await User.updateMany({}, { $set: { reviews: [] } });

    res.status(204).send(); // 204 No Content indicates successful deletion
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
