const express = require('express');
const router = express.Router({mergeParams:true});
const User = require('../models/user.js'); 

// GET /listings/page/:page - Gets all listings from all users paginated
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.params.page); // Requested page number
    const perPage = 2; // Number of listings per page 
    const skip = (page - 1) * perPage;

    // Find all users
    const users = await User.find();
    const allListings = users.flatMap((user) => user.listings);
    const listings = allListings.slice(skip, skip + perPage);
    const totalListings = allListings.length;
    const totalPages = Math.ceil(totalListings / perPage);
    const hasNextPage = page < totalPages;

    res.status(200).json({
      listings,
      page,
      totalPages,
      hasNextPage,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
