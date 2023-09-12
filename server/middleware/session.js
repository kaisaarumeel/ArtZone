const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto");


const session = async function (req, res, next) {
    //Login endpoint validates user password and generates session key.
    try{
        let authorization={
            "auth":false, // is user authorized
            "authEmail":"", // the user that is authorized
            "isAdmin":false // if the user is authed as admin
        }
        const expiry=parseInt(Date.now()/1000)+3600; //1h expiry
        const result=await UserSchema.findOneAndUpdate({"session.key":req.headers["x-auth-token"]},{expires:expiry});
        if(result!=null){
            if(parseInt(Date.now()/1000)<parseInt(result.session.expires)){
                authorization.auth=true;
                authorization.authEmail=result.userEmail;
                if(result.isAdmin){
                    authorization.isAdmin=true;
                }
            } else {
                authorization.auth=false;
            }            
        }
        req.authorization=authorization;    
        next()
    } catch(err){
        res.sendStatus(500);
    }
}

module.exports=session
