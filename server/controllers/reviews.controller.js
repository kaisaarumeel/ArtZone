let express = require("express");
//We use merge params to preserve req.params from the parent router.
const router = express.Router({ mergeParams: true });

const Reviews = require("../models/reviews.js");
const UserSchema = require("../models/user.js");
const { getUserByEmail } = require("../helper/general.helper.js");
const { validateReview } = require("../helper/reviews.helper.js");

//POST /users/:email/reviews/ - Adds review to user profile
router.post("/", async function (req, res) {

    try {
        const order = req.body.order;
        const userEmail = req.params.email;
        const reviewDescription = req.body.description;
        const reviewRating = req.body.rating;

        const newReview = new Reviews.model({
            description: reviewDescription,
            rating: reviewRating,
            orderHash: order
        })
        try {
            const error = await newReview.validate();
        } catch (error) {
            return res.sendStatus(400);
        }

        let result;
        try {
            result = await getUserByEmail(userEmail);
        } catch (err) {
            return res.sendStatus(404)
        }
        try {
            await validateReview(res, result, order)
            result.reviews.push(newReview)
            result.save();
            return res.sendStatus(201);
        } catch (err) {
            return res.sendStatus(403);
        }


    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

//GET /users/:email/reviews/ - Gets all reviews for a particular user

router.get("/", async function (req, res) {

    try {

        const userEmail = req.params.email;
        let user;
        try {
            user = await getUserByEmail(userEmail)
        } catch (error) {
            return res.status(404).send(err);
        }
        const reviews = user.reviews;
        return res.status(200).json(reviews);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

//GET /users/:email/reviews/:id - Gets a specific review for a particular user.

router.get("/:id", async function (req, res) {

    try {

        const userEmail = req.params.email;
        let user;
        try {
            try {
                user = await getUserByEmail(userEmail)
            } catch (err) {
                return res.sendStatus(404)
            }

        } catch (error) {
            return res.status(500).send(err);;
        }

        const reviewID = req.params.id;
        const foundReview = user.reviews.find(review => review.id === reviewID);

        if (!foundReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json(foundReview);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})


//DELETE /users/:email/reviews/:id - Removes a review in the system

router.delete("/:id", async function (req, res) {
    if (!req.auth.isAdmin) return res.sendStatus(403);
    try {
        const reviewID = req.params.id;
        const userEmail = req.params.email;

        try {
            const result = await UserSchema.findOneAndUpdate({ userEmail: userEmail }, { $pull: { reviews: { _id: reviewID } } });
            if (!result) {
                return res.status(404).json({ message: 'Review not found' });
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
//DELETE /users/:email/reviews/ - Removes all reviews from a user
router.delete("/", async function (req, res) {
    if (!req.auth.isAdmin) return res.sendStatus(403);

    try {
        const userEmail = req.params.email;
        const result = await UserSchema.findOneAndUpdate({ userEmail: userEmail }, { $set: { reviews: [] } });
        if (!result) {
            return res.sendStatus(404);
        }
        return res.sendStatus(204);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})
module.exports = router;