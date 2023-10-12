const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');

// GET /listings/page/:page - Gets all listings from all users paginated
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.params.page); // Requested page number
    const perPage = 6; // Number of listings per page 
    const startIndex = (page - 1) * perPage; //Starting index that we use for array slicing.

    // Find all users
    const users = await User.find();
    const showSoldQueryParams = req.query.showSold;
    let allListings = users.flatMap((user) => user.listings);
    if(showSoldQueryParams === 'false') {
      allListings = allListings.filter((listing) => !listing.sold); //Takes all listings in the entire system
    } 
    const sortQueryParam = String(req.query.sortBy);

    if (sortQueryParam === "ascending") {
      allListings.sort((a, b) => {
        if (a.price > b.price) return 1;
        if (a.price === b.price) return 0;
        if (a.price < b.price) return -1;
      });
    }

    if (sortQueryParam === "descending") {
      allListings.sort((a, b) => {
        if (a.price < b.price) return 1;
        if (a.price === b.price) return 0;
        if (a.price > b.price) return -1;
      });

    }
    //Listings that we show in this page
    const listings = allListings.slice(startIndex, startIndex + perPage);
    //Total number of listings
    const totalListings = allListings.length;
    //All pages
    const totalPages = Math.ceil(totalListings / perPage);
    //If it has another page or not.
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
