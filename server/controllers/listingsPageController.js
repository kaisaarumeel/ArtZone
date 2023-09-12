let express = require("express");
const router = express.Router({mergeParams:true});
const { Mongoose } = require("mongoose");

const ListingSchema = require("../models/listings.js");


// GET /listings/page/:page - Gets all listings in the system paginated
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.params.page);
        const perPage = 50; 

        // Calculate the skip value to skip listings on previous pages
        const skip = (page - 1) * perPage;

        // Query the database to retrieve listings for the specified page
        const listings = await ListingSchema.find()
            .skip(skip)
            .limit(perPage);

        // Determine the total number of listings in the system
        const totalListings = await ListingSchema.countDocuments();

        // Calculate the total number of pages based on the number of listings per page
        const totalPages = Math.ceil(totalListings / perPage);

        return res.status(200).json({
            listings,
            page,
            totalPages,
        });
    } catch (error) {
        console.error("Errors were found");
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;