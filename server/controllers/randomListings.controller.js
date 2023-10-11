const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');
const { shuffleArray } = require('../helper/randomListings.helper.js');

// GET /random-listings - Gets 5 random listings from the database

router.get('/', async (req, res) => {
  try {
    // Find all users
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users are in the system." });
    }

    // Collect all listings from all users
    const allListings = users.flatMap((user) => user.listings);
    const unsoldListings = allListings.filter((listing) => listing.sold === false)

    // Shuffle the array of listings to randomize them
    shuffleArray(unsoldListings);
    // Get the first 5 listings (or fewer if there are fewer listings)
    const randomListings = unsoldListings.slice(0, 5);

    res.status(200).json(randomListings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
