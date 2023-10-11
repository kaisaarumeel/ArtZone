const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const {randomUUID} = require("crypto")

async function generateSessionKey(req,email,res){
    req.success = true;
    const session_key = randomUUID(); //Generating new key
    const expiry = parseInt(Date.now() / 1000) + 3600; //1h expiry
    try {
        await UserSchema.findOneAndUpdate({ userEmail: email }, { session: { key: session_key, expires: expiry } });
        res.json({ "key": session_key, "expiry": expiry });
    } catch (err) {
        return res.sendStatus(500);
    }
}

async function saveNewUser(req,res,user) {
    if (req.body.isAdmin) {
        if (req.auth.isAdmin) {
            try {
                await user.save()
                return res.sendStatus(201);
            } catch (err) {
                if (err.code == 11000) {
                    return res.sendStatus(400);
                } else {
                    console.error(err)
                    return res.sendStatus(500);
                }
            }
        } else {
            return res.sendStatus(403);
        }
    } else {
        try {
            await user.save()
            return res.sendStatus(201);
        } catch (err) {
            if (err.code == 11000) {
                return res.sendStatus(400);
            } else {
                console.error(err)
                return res.sendStatus(500);
            }
        }
    }
}

module.exports ={
    generateSessionKey,saveNewUser
}

