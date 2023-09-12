// wiki.js - Wiki route module.
const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();
const session = require("../middleware/session")
// Home page route.
router.post("/login", async function (req, res) {
    //Login endpoint validates user password and generates session key.
    const email=req.body.userEmail;
    const password=req.body.password;
    try {
        const result=await UserSchema.findOne({userEmail:email})
        if(result==null){
            res.sendStatus(404);
        } else {
            if(password==result.password){
                req.success=true;
                const session_key=randomUUID(); //Generating new key
                const expiry=parseInt(Date.now()/1000)+3600; //1h expiry
                try{
                    await UserSchema.findOneAndUpdate({userEmail:email},{session:{key:session_key,expires:expiry}});
                    res.json({"key":session_key});
                } catch(err){
                    res.sendStatus(500);
                }
            } else {
                res.sendStatus(400);
            }
        }
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});


router.post("/register", async function (req, res) {
    const user=new UserSchema({
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        password: req.body.password,
        address:req.body.address,
        verificationStatus: false,
        userEmail: req.body.userEmail,
        isAdmin: req.body.isAdmin,
        listings: [],
        orders: [] 
    });
    const error=await user.validate()
    if(error){
        console.log(error)
        res.sendStatus(400);
        return;
    }
    if(req.body.isAdmin){
        if(req.authorization.isAdmin){
            try{
                await UserSchema.collection.insertOne(user);
                res.sendStatus(201);
            } catch(err){
                if(err.code==11000){
                    res.sendStatus(400);
                } else {
                    console.error(err)
                    res.sendStatus(500);
                }
            }
        } else {
            res.sendStatus(403);
        }
    } else {
        try{
            await UserSchema.collection.insertOne(user);
            res.sendStatus(201);
        } catch(err){
            if(err.code==11000){
                res.sendStatus(400);
            } else {
                console.error(err)
                res.sendStatus(500);
            }
        }
    }

});


module.exports = router;
