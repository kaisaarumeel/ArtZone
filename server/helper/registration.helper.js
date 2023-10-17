const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto")

async function generateSessionKey(req, email, res) {
    req.success = true;
    const session_key = randomUUID(); //Generating new key
    const expiry = parseInt(Date.now() / 1000) + 3600; //1h expiry
    await UserSchema.findOneAndUpdate({ userEmail: email }, { session: { key: session_key, expires: expiry } });
    res.json({ "key": session_key, "expiry": expiry });

}



module.exports = {
    generateSessionKey
}

