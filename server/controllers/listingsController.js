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

router.get("/users/:email/listings", async function(req, res){
    
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
      
//GET /users/:id/listings/:id - Get single listing

router.get("/users/:email/listings/:name", async function(req, res){
    
    try{

    const userEmail = req.params.email;
    const user = await UserSchema.findOne({userEmail:userEmail});

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const listingName = req.params.name;

    // Get the listing with the given name
    const foundListing = user.listings.find(listing => listing.name === listingName);

    if (!foundListing) {
        return res.status(404).json({ message: 'Listing not found' });
    }

    return res.status(200).json(foundListing);

    }catch(error){
        console.log("Errors were found");
        return res.status(500).json("Internal server error");
    }
})


//DELETE /users/:id/listings/:id - Removes a listing in the system

router.delete("/users/:email/listings/:name", async function(req, res){
    
    try{

    const userEmail = req.params.email;
    const user = await UserSchema.findOne({userEmail:userEmail});

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const listingName = req.params.name;

    // Get the listing with the given name
    const foundListing = user.listings.find(listing => listing.name === listingName);

    if (!foundListing) {
        return res.status(404).json({ message: 'Listing not found' });
    }

     // Use Array.prototype.filter() to remove the listing with the given name
     user.listings = user.listings.filter(listing => listing.name !== listingName);
     
     // Save the updated user object
     await user.save();
    
    }catch(error){
        console.log("Errors were found");
        return res.status(500).json("Internal server error");
    }
})
        
//PUT /users/:id/listings/:id - Full update on a listing in the system at the specified resource.

    router.put("/users/:email/listings/:name", async function(req, res){
        try{
            const userEmail = req.params.email;
            const user = await UserSchema.findOne({userEmail:userEmail});

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const listingName = req.params.name;

            const foundListing = user.listings.find(listing => listing.name === listingName);
        
            if (!foundListing) {
                return res.status(404).json({ message: 'Listing not found' });
            }

            foundListing.name = req.body.name;
            foundListing.author = req.body.author;
            foundListing.price = req.body.price;
            foundListing.picture = req.body.picture;
            
            await user.save();

            return res.status(200).json(foundListing);
        
        }catch(error){
            console.log("Errors were found");
            return res.status(500).json("Internal server error");
        }
    })    

//PATCH /users/:id/listings/:id - Partial update a listing in the system at the specified resource.

router.patch("/users/:email/listings/:name", async function(req, res){
    try{
        const userEmail = req.params.email;
        const user = await UserSchema.findOne({userEmail:userEmail});

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const listingName = req.params.name;

        const foundListing = user.listings.find(listing => listing.name === listingName);
    
        if (!foundListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        for (key in req.body){
            foundListing[key]=req.body[key];
        }
        
        await user.save();

        return res.status(200).json(foundListing);
    
    }catch(error){
        console.log("Errors were found");
        return res.status(500).json("Internal server error");
    }
})    


module.exports = router;