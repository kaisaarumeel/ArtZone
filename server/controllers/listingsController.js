let express = require("express");
//We use merge params to preserve req.params from the parent router.
const router = express.Router({mergeParams:true});
const { Mongoose, default: mongoose } = require("mongoose");

const Listings = require("../models/listings.js");
const UserSchema = require("../models/user.js");



//POST /users/:id/listings - Adds a listing to the system
router.post("/", async function(req, res){

    try {
        const userEmail = req.params.email;
        const listingName = req.body.name;
        const listingAuthor = req.body.author;
        const listingPrice = req.body.price;
        const listingPicture = req.body.picture;

        // Check if any of the required attributes are missing
    if (!listingName || !listingAuthor || !listingPrice || !listingPicture) {
        return res.status(400).json({ message: 'Missing required attributes' });
      }

        const newListing = new Listings.model({
            name: listingName,
            author: listingAuthor,
            price: listingPrice,
            picture: listingPicture
        })
        try{
            const result=await UserSchema.findOneAndUpdate({userEmail:userEmail},{$push:{listings:newListing}});
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }
        }catch(err){
            console.log(err);
            return res.sendStatus(500);
        } 
        return res.sendStatus(201);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
        
//GET /users/:id/listings - Get my listings

router.get("/", async function(req, res){
    
    try{

    const userEmail = req.params.email;
    let user;
    try{
        user = await UserSchema.findOne({userEmail:userEmail});

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        }catch(error){
            return res.status(500).send(err);;
        } 


    const listings = user.listings;
        console.log(listings);
    return res.status(200).json(listings);


    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
})
      
//GET /users/:id/listings/:id - Get single listing

router.get("/:name", async function(req, res){
    
    try{

    const userEmail = req.params.email;
    let user;
    try{
        user = await UserSchema.findOne({userEmail:userEmail});

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        }catch(error){
            return res.status(500).send(err);;
        } 

    const listingName = req.params.name;

    // Get the listing with the given name
    const foundListing = user.listings.find(listing => listing.name === listingName);

    if (!foundListing) {
        return res.status(404).json({ message: 'Listing not found' });
    }

    return res.status(200).json(foundListing);

    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
})



//DELETE /users/:id/listings/:id - Removes a listing in the system

router.delete("/:name", async function(req, res){
    
    try{
    const listingName = req.params.name;
    const userEmail = req.params.email;
    
        try{
            const result=await UserSchema.findOneAndUpdate({userEmail:userEmail},{$pull:{listings:{name:listingName}}});
            if (!result) {
                return res.status(404).json({ message: 'Listing not found' });
            }

        return res.sendStatus(200);
        }catch(err){
            console.log(err);
            return res.sendStatus(500);
        } 
    } catch(error) {
    console.log(error);
    return res.sendStatus(500);
    }
})
        
//PUT /users/:id/listings/:id - Full update on a listing in the system at the specified resource.
    router.put("/:name", async function(req, res){
        try{
            const userEmail = req.params.email;
            const listingName = req.params.name;
            try{
                // Check if any of the required attributes are missing
            if (
                !req.body.name ||
                !req.body.author ||
                !req.body.price ||
                !req.body.picture
            ) {
                return res.status(400).json({ message: 'Missing required attributes' });
            }
            
                const newListing = new Listings.model({
                    name: req.body.name,
                    author: req.body.author,
                    price: req.body.price,
                    picture: req.body.picture
                })
                let result=await UserSchema.findOneAndUpdate(
                    {
                        userEmail:userEmail,
                        "listings.name":listingName
                    },
                    {
                        $set: { 
                        "listings.$": newListing  } 
                    }
                    );

                if (!result) {
                    return res.status(404).json({ message: 'Listing not found' });
                }
    
            return res.sendStatus(200);
            }catch(err){
                console.log(err);
                return res.sendStatus(500);
            } 
        } catch(error) {
        console.log(error);
        return res.sendStatus(500);
        }
    })    

//PATCH /users/:id/listings/:id - Partial update a listing in the system at the specified resource.

router.patch("/:name", async function(req, res){
    try{
        const userEmail = req.params.email;
        const listingName = req.params.name;
        const data = req.body;
        console.log(data);
  
    try{
        let result=await UserSchema.findOneAndUpdate(
            {
                userEmail:userEmail,
                "listings.name":listingName
            },
            {
                $set: { 
                "listings.$": data } 
            }
            );

        if (!result) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        return res.sendStatus(200);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    } 
        } catch(error) {
        console.log(error);
        return res.sendStatus(500);
        }
    
})    


module.exports = router;