const UserSchema = require("../models/schema"); //this is the schema class. Use this class to make 

const register = function (req, res, next) {
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
    const error=user.validateSync()
    if(error){
        console.log(error)
        req.status=400;
        return;
    }


    if(req.body.isAdmin){
        console.log(req.headers)
        if(req.headers["x-auth-token"]==undefined){
            req.status=400;
        } else {
            const query=UserSchema.findOne({"session.key":req.headers["x-auth-token"]});
            const result=query.then((result)=>{ 
                console.log(result)        
                if(result!=null){
                    if(result.isAdmin){
                        UserSchema.collection.insertOne(user).then(()=>{
                            req.status=201;
                            next()
                        }).catch((err)=>{
                            console.log(err)
                            req.status=400;
                            next() 
                        });
                    } else {
                        req.status=403;
                        next() 
                    }
                    
                } else {
                    req.status=400;
                    next() 
                }      

            }).catch((err)=>{
                req.status=500;
            })
        }
    } else {
        UserSchema.collection.insertOne(user).then(()=>{
            req.status=201;
            next()
        }).catch(()=>{
            req.status=400;
            next() 
        });

    }
    

    
}

module.exports=register