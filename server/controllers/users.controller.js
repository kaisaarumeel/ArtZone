// wiki.js - Wiki route module.
const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const express = require("express");
const router = express.Router({ mergeParams: true });
const { getUserByEmail } = require("../helper/general.helper");

router.get("/", async (req, res) => {
    try {
        const id = req.params.email;
        try {
            let user;
            try {
                user = (await getUserByEmail(id)).toObject()
            } catch (err) {
                console.log(err)
                return res.sendStatus(404)
            }
            if (!req.auth.auth) return res.sendStatus(403);
            if (req.auth.auth && req.auth.authEmail != id && !req.auth.isAdmin) return res.sendStatus(403);
            let sanitized_user = user;
            delete sanitized_user["session"];
            delete sanitized_user["password"];
            delete sanitized_user["_id"]
            return res.json(sanitized_user);
        } catch (err) {
            return res.sendStatus(400);
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500);
    }
})

router.patch("/", async (req, res) => {
    try {
        const email = req.params.email;
        try {
            if (!req.auth.auth) return res.sendStatus(403);
            if (req.auth.auth && req.auth.authEmail != email && !req.auth.isAdmin) return res.sendStatus(403);
            delete req.body["session"];
            const data = req.body;
            if(data.userEmail!==undefined && data.userEmail!==req.params.email) {
                let user;
                try {
                    user = await getUserByEmail(req.params.email)
                } catch (err) {
                    console.log(err)
                    return res.sendStatus(404);
                }

                for(let i=0;i<user.listings.length;i++) {
                    if(user.listings[i].creator===req.params.email) {
                        user.listings[i].creator=data.userEmail;
                    }
                }

                for(let i=0;i<user.orders.length;i++) {
                    if(user.orders[i].buyer===req.params.email) {
                        user.orders[i].buyer=data.userEmail;
                        //Propagate changes at sellers order as well
                        try {
                            let seller = await getUserByEmail(user.orders[i].seller)
                            for(let x=0;x<seller.orders.length;x++) {
                                if(seller.orders[x].buyer===req.params.email) {
                                    user.orders[x].buyer=data.userEmail;

                                }
                            }

                            seller.save()
                        } catch (err) {
                            console.log(err)
                            return res.sendStatus(404);
                        }
                    }
                    if(user.orders[i].seller===req.params.email) {
                        user.orders[i].seller=data.userEmail;
                        //Propagate changes at buyers order as well
                        try {
                            let buyer = await getUserByEmail(user.orders[i].buyer)
                            for(let x=0;x<buyer.orders.length;x++) {
                                if(buyer.orders[x].seller===req.params.email) {
                                    buyer.orders[x].seller=data.userEmail;
                                }
                            }

                            buyer.save()
                        } catch (err) {
                            console.log(err)
                            return res.sendStatus(404);
                        }
                    }
                }
                user.save()
            }



            let user = await UserSchema.collection.findOneAndUpdate({ userEmail: email }, { $set: data }, { new: true });
            if (!user) return res.sendStatus(404);

            //Check if user is trying to change their email
            
            return res.sendStatus(200);
        } catch (err) {
            console.log(err)
            return res.sendStatus(400);
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500);
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
                oldUser = await getUserByEmail(email)
            } catch (err) {
                return res.sendStatus(404)
            
            }

            if(req.body.userEmail!==undefined && req.body.userEmail!==req.params.email) {
                let user;
                try {
                    user = await getUserByEmail(req.params.email)
                } catch (err) {
                    console.log(err)
                    return res.sendStatus(404);
                }

                for(let i=0;i<user.listings.length;i++) {
                    if(user.listings[i].creator===req.params.email) {
                        user.listings[i].creator=req.body.userEmail;
                    }
                }

                for(let i=0;i<user.orders.length;i++) {
                    if(user.orders[i].buyer===req.params.email) {
                        user.orders[i].buyer=req.body.userEmail;
                        //Propagate changes at sellers order as well
                        try {
                            let seller = await getUserByEmail(user.orders[i].seller)
                            for(let x=0;x<seller.orders.length;x++) {
                                if(seller.orders[x].buyer===req.params.email) {
                                    user.orders[x].buyer=req.body.userEmail;

                                }
                            }

                            seller.save()
                        } catch (err) {
                            console.log(err)
                            return res.sendStatus(404);
                        }
                    }
                    if(user.orders[i].seller===req.params.email) {
                        user.orders[i].seller=req.body.userEmail;
                        //Propagate changes at buyers order as well
                        try {
                            let buyer = await getUserByEmail(user.orders[i].buyer)
                            for(let x=0;x<buyer.orders.length;x++) {
                                if(buyer.orders[x].seller===req.params.email) {
                                    buyer.orders[x].seller=req.body.userEmail;
                                }
                            }

                            buyer.save()
                        } catch (err) {
                            console.log(err)
                            return res.sendStatus(404);
                        }
                    }
                }
                user.save()
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
            return res.sendStatus(400);
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500);
    }
})
router.delete("/", async (req, res) => {
    try {
        try {
            if (!req.auth.isAdmin) res.sendStatus(403);
            await UserSchema.collection.deleteOne({ userEmail: req.params.email })
            return res.sendStatus(200);
        } catch (err) {
            console.log(err)
            return res.sendStatus(400);
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500);
    }
})



module.exports = router;
