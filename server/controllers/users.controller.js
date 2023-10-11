// wiki.js - Wiki route module.
const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const express = require("express");
const router = express.Router({ mergeParams: true });
const { getUserByEmail } = require("../helper/general.helper");

router.get("/", async (req, res) => {
    try {
        const id = req.params.id;
        try {
            let user;
            try {
                user = await getUserByEmail(id, res)
            } catch (err) {
                return res.sendStatus(404)
            }
            if (!req.auth.auth) return res.sendStatus(403);
            if (req.auth.auth && req.auth.authEmail != id && !req.auth.isAdmin) return res.sendStatus(403);
            let sanitized_user = user;
            delete sanitized_user["session"];
            delete sanitized_user["password"];
            delete sanitized_user["_id"]
            res.json(sanitized_user);
        } catch (err) {
            res.sendStatus(400);
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})

router.patch("/", async (req, res) => {
    try {
        const email = req.params.email;
        try {
            if (!req.auth.auth) res.sendStatus(403);
            if (req.auth.auth && req.auth.authEmail != email && !req.auth.isAdmin) res.sendStatus(403);
            delete req.body["session"];
            const data = req.body;
            let user = await UserSchema.collection.findOneAndUpdate({ userEmail: email }, { $set: data }, { new: true });
            res.sendStatus(200);
            if (!user) res.sendStatus(404);
        } catch (err) {
            console.log(err)
            res.sendStatus(400);
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})

router.put("/", async (req, res) => {
    try {
        const email = req.params.email;
        try {
            if (!req.auth.auth) res.sendStatus(403);
            if (req.auth.auth && req.auth.authEmail != email && !req.auth.isAdmin) res.sendStatus(403);
            let oldUser;
            try {
                oldUser = await getUserByEmail(email, res)
            } catch (err) {
                return res.sendStatus(404)
            }
            const new_user = new UserSchema({
                name: req.body.name,
                dateOfBirth: req.body.dateOfBirth,
                password: req.body.password,
                address: req.body.address,
                verificationStatus: false,
                userEmail: req.body.userEmail,
                isAdmin: req.body.isAdmin,
                listings: oldUser.listings,
                orders: oldUser.orders
            }, { _id: false });

            const error = await new_user.validate()
            if (error) {
                console.log(error)
                res.sendStatus(400);
                return;
            }
            let user = await UserSchema.collection.findOneAndUpdate({ userEmail: email }, { $set: new_user });
            res.sendStatus(200);
            if (!user) res.sendStatus(404);
        } catch (err) {
            console.log(err)
            res.sendStatus(400);
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})
router.delete("/", async (req, res) => {
    try {
        try {
            if (!req.auth.isAdmin) res.sendStatus(403);
            await UserSchema.collection.deleteOne({ userEmail: req.params.email })
            res.sendStatus(200);
        } catch (err) {
            console.log(err)
            res.sendStatus(400);
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})



module.exports = router;
