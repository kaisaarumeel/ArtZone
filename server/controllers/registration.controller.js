const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const express = require("express");
const router = express.Router();
const { getUserByEmail, validateEmail } = require("../helper/general.helper");
const { generateSessionKey, saveNewUser } = require("../helper/registration.helper");



// Home page route.
router.post("/users/login", async (req, res) => {
    //Login endpoint validates user password and generates session key.
    const email = req.body.userEmail;
    const password = req.body.password;
    try {

        let result;
        try {
            result = await getUserByEmail(email)
        } catch (err) {
            return res.sendStatus(404)
        }
        if (password == result.password) {
            await generateSessionKey(req, email, res);
        } else {
            return res.sendStatus(400);
        }


    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});


router.post("/users/register", async (req, res) => {
    try {
        await validateEmail(req.body.userEmail, res)
    } catch (err) {
        return res.status(400).json({ "message": "Invalid email provided" });
    }
    if (req.body.address.country.length > 2) return res.status(400).json({ message: "Invalid country code" })
    const user = new UserSchema({
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        password: req.body.password,
        address: req.body.address,
        userEmail: req.body.userEmail,
        isAdmin: req.body.isAdmin,
        listings: [],
        orders: []
    });
    if (req.body.isAdmin === true && req.auth.isAdmin !== true) return res.sendStatus(403);


    try {
        await user.validate()
        await user.save()
        return res.sendStatus(201);

    } catch (err) {
        return res.sendStatus(400);
    }
});



module.exports = router;