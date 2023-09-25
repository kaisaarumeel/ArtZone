const express = require('express');
const router = express.Router({mergeParams:true});
const User = require('../models/user.js'); 

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
  
      // Shuffle the array of listings to randomize them
      shuffleArray(allListings);
  
      // Get the first 5 listings (or fewer if there are fewer listings)
      const randomListings = allListings.slice(0, 5);
  
      res.status(200).json(randomListings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Function to shuffle an array in-place (Fisher-Yates shuffle)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
module.exports = router;
