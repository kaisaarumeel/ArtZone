let express = require("express");
const router = express.Router();
const { Mongoose } = require("mongoose");

const ListingSchema = require("../models/listings.js");
const UserSchema = require("../models/user.js");


//POST /users/:id/listings - Adds a listing to the system
router.post("/users/:email/listings", async function(req, res){
    
    try {
        const userEmail = req.params.email;
        
        const listingName = req.body.name;
        const listingAuthor = req.body.author;
        const listingPrice = req.body.price;
        const listingPicture = req.body.picture;

        const user = await UserSchema.findOne({userEmail:userEmail});

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newListing = new ListingSchema({
            name: listingName,
            author: listingAuthor,
            price: listingPrice,
            picture: listingPicture
        })

        //await newListing.save();

        user.listings.push(newListing);

        await user.save();

        return res.status(201).json("Listing added successfully!");

    }catch(error) {
        console.log("Errors were found");
        return res.status(500).json("Internal server error");
    }
});
        
//GET /users/:id/listings - Get my listings

router.get("/users:email/listings", async function(req, res){
    
    try{

    const userEmail = req.params.email;
    const user = await UserSchema.findOne({userEmail:userEmail});

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const listings = user.listings;

    return res.status(200).json(listings);

    }catch(error){
        console.log("Errors were found");
        return res.status(500).json("Internal server error");
    }
})
        
//GET /listings/page/:page  - Gets all listing in the system paginated.

        
//DELETE /users/:id/listings/:id - Removes a listing in the system

        
//PUT /users/:id/listings/:id - Full update on a listing in the system at the specified resource.

        
//PATCH /users/:id/listings/:id - Partial update a listing in the system at the specified resource.

        
//GET /users/:id/listings/:id - Get single listing

