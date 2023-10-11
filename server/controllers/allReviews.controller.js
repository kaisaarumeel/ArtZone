const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');
const { getAllReviewsFromSystem } = require('../helper/allReviews.helper.js');

// GET /reviews - Gets all reviews from all users
router.get('/', async (req, res) => {
  if (!req.auth.isAdmin) return res.sendStatus(403);

  try {
    // Find all users
    const users = await User.find();
    if (!users) return res.status(200).json({ "message": "no users are in the system." });

    const reviews = await getAllReviewsFromSystem(users)
    if (!reviews || reviews.length === 0) return res.status(200).json({ "message": "no reviews are saved in the system." });

    return res.status(200).json({
      reviews
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

router.delete('/', async (req, res) => {
  if (!req.auth.isAdmin) return res.sendStatus(403);
  try {
    // Delete all reviews from the database
    await User.updateMany({}, { $set: { reviews: [] } });

    return res.sendStatus(204); // 204 No Content indicates successful deletion
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
