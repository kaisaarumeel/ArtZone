let express = require("express");
//We use merge params to preserve req.params from the parent router.
const router = express.Router({ mergeParams: true });

const Listings = require("../models/listings.js");
const UserSchema = require("../models/user.js");
const { getUserByEmail } = require("../helper/general.helper.js");



//POST /users/:email/listings - Adds a listing to the system
router.post("/", async function (req, res) {

    try {
        const userEmail = req.params.email;
        const listingName = req.body.name;
        const listingAuthor = req.body.author;
        const listingPrice = req.body.price;
        const listingPicture = req.body.picture;
        const listingDescription = req.body.description;
        const newListing = new Listings.model({
            name: listingName,
            author: listingAuthor,
            price: listingPrice,
            picture: listingPicture,
            description: listingDescription,
            creator: userEmail,
            sold: false,
        })
        try {
            const error = await newListing.validate();
        } catch (error) {
            console.log(error)
            return res.sendStatus(400);
        }
        try {
            const result = await UserSchema.findOneAndUpdate({ userEmail: userEmail }, { $push: { listings: newListing } });
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        return res.status(201).json({ id: newListing._id });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

//GET /users/:email/listings - Get my listings
router.get("/", async function (req, res) {

    try {

        const userEmail = req.params.email;
        let user;
        try {
            user = await getUserByEmail(userEmail)
        } catch (error) {
            return res.status(404).send(err);
        }

        const listings = user.listings;
        return res.status(200).json(listings);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

//GET /users/:email/listings/:id - Get single listing

router.get("/:id", async function (req, res) {

    try {

        const userEmail = req.params.email;
        let user;
        try {
            user = await getUserByEmail(userEmail)
        } catch (error) {
            return res.status(404).send(err);;
        }
        const listingID = req.params.id;

        // Get the listing with the given name
        const foundListing = user.listings.find(listing => listing.id === listingID);
        if (!foundListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        return res.status(200).json(foundListing);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})



//DELETE /users/:email/listings/:id - Removes a listing in the system

router.delete("/:id", async function (req, res) {

    try {
        const listingID = req.params.id;
        const userEmail = req.params.email;
        let user;
        try {
            user = await getUserByEmail(userEmail)
        } catch (err) {
            return res.sendStatus(404);
        }

        let listing = user.listings.find(listing => listing.id == req.params.id);
        if (!listing) {
            res.status(404).json({ "message": "Seller Listing was not found." });
            return;
        }

        if (listing.sold === true) return res.status(403).json({ "message": "You cannot delete a listing that has been ordered." });

        try {
            const result = await UserSchema.findOneAndUpdate({ userEmail: userEmail }, { $pull: { listings: { _id: listingID } } });
            if (!result) {
                return res.status(404).json({ message: 'Listing not found' });
            }

            return res.sendStatus(204);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

//DELETE /users/:email/listings/ - Removes all listings from a user

router.delete("/", async function (req, res) {

    try {
        const userEmail = req.params.email;
        let user;
        try {
            user = await getUserByEmail(userEmail)
        } catch (err) {
            return res.sendStatus(404);
        }
        for (let i = 0; i < user.listings.length; i++) {
            if (user.listings[i].sold !== true) {
                user.listings.splice(i, 1)
                i--;
            }
        }
        user.save()
        return res.sendStatus(204);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

//PUT /users/:email/listings/:id - Full update on a listing in the system at the specified resource.
router.put("/:id", async function (req, res) {
    try {
        const userEmail = req.params.email;
        const listingID = req.params.id;
        try {
            let put_data = {
                "listings.$.name": req.body.name,
                "listings.$.author": req.body.author,
                "listings.$.price": req.body.price,
                "listings.$.picture": req.body.picture,
                "listings.$.description": req.body.description,
            }
            for (let key in put_data) {
                if (put_data[key] === undefined) {
                    return res.sendStatus(400);
                }
            }

            let result = await UserSchema.findOneAndUpdate(
                {
                    userEmail: userEmail,
                    "listings._id": listingID
                },
                {
                    $set: {
                        ...put_data
                    }
                },
                { runValidators: true, }
            );

            if (!result) {
                return res.status(404).json({ message: 'Listing not found' });
            }

            return res.sendStatus(200);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

//PATCH /users/:email/listings/:name - Partial update a listing in the system at the specified resource.

router.patch("/:id", async function (req, res) {
    try {
        const userEmail = req.params.email;
        const listingID = req.params.id;
        try {
            let patch_data = {}
            for (let key in req.body) {
                patch_data["listings.$." + key] = req.body[key];
            }

            let result = await UserSchema.findOneAndUpdate(
                {
                    userEmail: userEmail,
                    "listings._id": listingID
                },
                {

                    $set: {
                        ...patch_data
                    },

                },
                {
                    runValidators: true,
                }

            );
            if (!result) {
                return res.status(404).json({ message: 'Listing not found' });
            }

            return res.sendStatus(200);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

})




module.exports = router;