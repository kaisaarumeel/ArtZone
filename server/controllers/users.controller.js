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
            delete sanitized_user["orders"]
            delete sanitized_user["listings"]
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
            if (data.userEmail !== undefined && data.userEmail !== req.params.email) {
                let user;
                try {
                    user = await getUserByEmail(req.params.email)
                } catch (err) {
                    console.log(err)
                    return res.sendStatus(404);
                }

                for (let i = 0; i < user.listings.length; i++) {
                    if (user.listings[i].creator === req.params.email) {
                        user.listings[i].creator = data.userEmail;
                    }
                }

                for (let i = 0; i < user.orders.length; i++) {
                    if (user.orders[i].buyer === req.params.email) {
                        user.orders[i].buyer = data.userEmail;
                        console.log(user.orders[i])
                        //Propagate changes at sellers order as well
                        try {
                            let seller = await getUserByEmail(user.orders[i].seller)
                            for (let x = 0; x < seller.orders.length; x++) {
                                if (seller.orders[x].buyer === req.params.email) {
                                    seller.orders[x].buyer = data.userEmail;

                                }
                            }

                            await seller.save()
                        } catch (err) {
                            console.log(err)
                            return res.sendStatus(404);
                        }
                    }
                    if (user.orders[i].seller === req.params.email) {
                        user.orders[i].seller = data.userEmail;
                        //Propagate changes at buyers order as well
                        try {
                            let buyer = await getUserByEmail(user.orders[i].buyer)
                            for (let x = 0; x < buyer.orders.length; x++) {
                                if (buyer.orders[x].seller === req.params.email) {
                                    buyer.orders[x].seller = data.userEmail;
                                }
                            }

                            await buyer.save()
                        } catch (err) {
                            console.log(err)
                            return res.sendStatus(404);
                        }
                    }
                }
                await user.save()
            }



            let result = await UserSchema.collection.findOneAndUpdate({ userEmail: email }, { $set: data }, { new: true });
            if (!result) return res.sendStatus(404);

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
            let user;

                try {
                    user = await getUserByEmail(req.params.email)
                } catch (err) {
                    console.log(err)
                    return res.sendStatus(404);
                }

                for (let i = 0; i < user.listings.length; i++) {
                    if (user.listings[i].creator === req.params.email) {
                        user.listings[i].creator = req.body.userEmail;
                    }
                }

                for (let i = 0; i < user.orders.length; i++) {
                    if (user.orders[i].buyer === req.params.email) {
                        user.orders[i].buyer = req.body.userEmail;
                        //Propagate changes at sellers order as well
                        try {
                            let seller = await getUserByEmail(user.orders[i].seller)
                            for (let x = 0; x < seller.orders.length; x++) {
                                if (seller.orders[x].buyer === req.params.email) {
                                    seller.orders[x].buyer = req.body.userEmail;
                                }
                            }

                            await seller.save()
                        } catch (err) {
                            console.log(err)
                            return res.sendStatus(404);
                        }
                    } else if (user.orders[i].seller === req.params.email) {
                        user.orders[i].seller = req.body.userEmail;
                        //Propagate changes at buyers order as well
                        try {
                            let buyer = await getUserByEmail(user.orders[i].buyer)
                            for (let x = 0; x < buyer.orders.length; x++) {
                                if (buyer.orders[x].seller === req.params.email) {
                                    buyer.orders[x].seller = req.body.userEmail;
                                }
                            }

                            await buyer.save()
                        } catch (err) {
                            console.log(err)
                            return res.sendStatus(404);
                        }
                    }
                }
                await user.save()
        

            const new_user = new UserSchema({
                name: req.body.name,
                dateOfBirth: req.body.dateOfBirth,
                password: req.body.password,
                address: req.body.address,
                userEmail: req.body.userEmail,
                isAdmin: req.body.isAdmin,
                orders:user.orders,
                listings:user.listings,
                reviews:user.reviews
            }, { _id: false });

            const error = await new_user.validate()
            if (error) {
                console.log(error)
                res.sendStatus(400);
                return;
            }
            let response = await UserSchema.collection.findOneAndUpdate({ userEmail: email }, { $set: new_user });
            if (!response) return res.sendStatus(404);

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
router.delete("/", async (req, res) => {
    try {
        try {
            if (!req.auth.isAdmin) res.sendStatus(403);
            console.log(req.params.email)
            let user;
            try {
                user = await getUserByEmail(req.params.email)
            } catch (err) {
                console.log(err)
                return res.sendStatus(404);
            }
            for (let i = 0; i < user.orders.length; i++) {
                if (user.orders[i].buyer === req.params.email) {
                    //Propagate changes at sellers order as well
                    try {
                        let seller = await getUserByEmail(user.orders[i].seller) //bob@gmail.com
                        let ordersNotWithBuyer = seller.orders.filter(order => order.buyer !== req.params.email); //seller: bob@gmail.com buyer:bobsfriend@gmail.com

                        let ordersWithBuyer = seller.orders.filter(order => order.buyer === req.params.email);
                        for (let x = 0; x < ordersWithBuyer.length; x++) {
                            let listingId = ordersWithBuyer[x].listing;
                            for (let y = 0; y < seller.listings.length; y++) {
                                if (listingId === seller.listings[y].id) {
                                    seller.listings[y].sold = false;
                                }
                            }
                        }
                        seller.orders = ordersNotWithBuyer;
                        await seller.save()
                    } catch (err) {
                        console.log(err)
                        return res.sendStatus(404);
                    }
                } else if (user.orders[i].seller === req.params.email) {
                    //Propagate changes at buyers order as well
                    try {
                        let buyer = await getUserByEmail(user.orders[i].buyer)
                        let ordersNotWithSeller = buyer.orders.filter(order => order.seller !== req.params.email);
                        buyer.orders = ordersNotWithSeller;
                        await buyer.save()
                    } catch (err) {
                        console.log(err)
                        return res.sendStatus(404);
                    }
                }
            }

            await UserSchema.collection.deleteOne({ userEmail: req.params.email })
            return res.sendStatus(204)
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
