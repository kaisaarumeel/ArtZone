const UserSchema = require("../models/schema"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto");


const login = function (req, res, next) {
    const email=req.body.userEmail;
    const password=req.body.password;
    const result=UserSchema.findOne({userEmail:email})
    result.then((result)=>{
        if(result==null){
            req.status=404;
            next()

        } else {
            if(password==result.password){
                req.success=true;
                const session_key=randomUUID(); //Generating new key
                const expiry=parseInt(Date.now()/1000)+3600; //1h expiry
                UserSchema.findOneAndUpdate({userEmail:email},{session:{key:session_key,expires:expiry}}).then((update_result)=>{
                    req.status=200;
                    req.key=session_key;
                    next()

                }).catch((err)=>{
                    req.status=500;
                    next()
                });
            } else {
                req.status=400;
                next()
            }
        }
    }).catch((err)=>{
        console.log(err)
        req.status=500;
        next()


    })

}

module.exports=login
