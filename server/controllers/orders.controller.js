const mongoose = require("mongoose");
const express = require("express");
const router = express.Router({"mergeParams": true});
const OrderModel = require("../models/orders.js");
const UserModel = require("../models/user.js");
const { createHash, randomUUID } = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');

const pp_client="AQAquHqyXLu-wDbXuWcL4hEKe-ay87Vco719EUZLpufXR1ouqoGkNCId9ZFAWM7Xef3H_UJ0vpZh5_hF";
const pp_secret="EL03GoWvTdp-eVBu6l_OWEVe2ay083mqOqMvgk-dsBAQ2gA2niRvshNzDbZT9zx7m7Xj0etG0sg2a_xt";
const env = new paypal.core.SandboxEnvironment(pp_client, pp_secret);
const client = new paypal.core.PayPalHttpClient(env);



//posting an order on the database the email in the url is the buyer
router.post("/", async (req, res) => {

    try {

        const user = await UserModel.findOne({ userEmail: req.params.email });
        if (!user) {
           res.status(404).json({"message": "User was not found."});
           return;
        }

        const sellerEmail = String(req.body.seller);
        //we use regx here to confirm that the email is of the right format.
        if (!sellerEmail.match(/.*@.*/)){
            res.status(400).json({ "message": "The provided seller information is not an email. you need to provide the seller's email"});
            return;
        }

        const seller = await UserModel.findOne({ userEmail: sellerEmail });
        if (!seller) {
            res.status(404).json({"message": "The given seller does not exist."});
            return;
        }

        let sellerListing = seller.listings.find(listing => listing.id === req.body.listing);
        if (!sellerListing) {
            res.status(400).json({"message": "The seller does not posses the listing you want to order"});
            return;
        }

        if (seller.userEmail === user.userEmail) {
            res.status(400).json({"message": "You cannot buy your own art."})
            return;
        }

        const userOrders = user.orders;
        if (userOrders) {
            //user cannot the same listing from the seller.
            const sameOrder = userOrders.find(order =>  order.listing === req.body.listing && order.seller === req.body.seller);
            if (sameOrder) {
                res.status(403).json({"message": "You have already ordered the following listing."});
                return;
            }
        } 
        let response={
            "result":{
                "id":"0"
            }
        };
        if(!req.body.simulate){
            request = new paypal.orders.OrdersCaptureRequest(req.body.paypalOrderId);
            request.requestBody({});
            // Call API with your client and get a response for your call
            response = await client.execute(request);
        }

        sellerListing.sold=true;
        let msg=Date.now().toString()+req.body.seller+req.params.email+req.body.listing+randomUUID();
        let hash=createHash('sha256').update(msg).digest('hex'); 
        console.log(response)
        const paypalOrderId=response.result.id;
        seller.orders.push(new OrderModel.model({
            seller: req.body.seller,
            buyer:req.params.email,
            listing: req.body.listing,
            hash:hash,
            isReceived:false,
            isShipped:false,
            paypalOrderId:paypalOrderId
        }));
        user.orders.push(new OrderModel.model({
            seller: req.body.seller,
            buyer:req.params.email,
            listing: req.body.listing,
            hash:hash,
            isReceived:false,
            isShipped:false,
            paypalOrderId:paypalOrderId
        }));

        seller.save();
        user.save();

        return res.status(201).json(response.result);


        
    } catch(err) {
        res.sendStatus(500);
        console.log(err)
    }
    
});

router.get("/", async (req, res) => {

    try{

        const user = await UserModel.findOne({userEmail: req.params.email});
        if (!user) {
            res.status(404).json({"message": "User was not found."});
            return;
        }

        if (!user.orders || user.orders.length == 0) {
            res.status(200).json({ "message": "You have no orders on your orders list" });
            return;
        }

        const links = new Array();
        for (let key of user.orders) {
            links.push({
               rel: "get specific order",
               method: "GET",
               href: `/api/v1/users/${user.userEmail}/${key._id}`
            });
        }

        res.status(200).json({orders: user.orders, links: links});

    } catch(err) {
        res.sendStatus(500)
        console.log(err);
    }

});

router.delete("/:id", async (req,res)=>{
    if(!req.auth.isAdmin) return res.sendStatus(403);
    try{
        const orderID = req.params.id;
        const userEmail = req.params.email;
        
            try{
                const result=await UserModel.findOneAndUpdate({userEmail:userEmail},{$pull:{orders:{_id:orderID}}});
                if (!result) {
                    return res.status(404).json({ message: 'Listing not found' });
                }
    
            return res.sendStatus(204);
            }catch(err){
                console.log(err);
                return res.sendStatus(500);
            } 
        } catch(error) {
        console.log(error);
        return res.sendStatus(500);
        }
})

router.patch("/:id", async (req, res) => {

    try {

        const user = await UserModel.findOne({ userEmail: req.params.email });
        if (!user) {
            res.status(404).json({"message": "User was not found."});
            return;
        }  

        let order = user.orders.find(order => order._id == req.params.id);
        if (!order) {
            res.status(404).json({"message": "Order was not found."});
            return;
        }

        for(key in req.body){
            if (order.seller === user.userEmail && key === 'isShipped') {
                order[key]=req.body[key];
            } else if (order.buyer === user.userEmail && key === 'isReceived') {
                if (order.isShipped === true) {
                    order[key]=req.body[key];
                }
            } else {
                break;
            }
        }
        try{
            const error = await order.validate()
        } catch(err){
            return res.status(400).json({"message": "Order validation failed"})
        }
        
        user.save();
        res.sendStatus(200);

    } catch(err) {
        res.sendStatus(500);
        console.log(err);
    }

});

router.get("/:id", async (req, res) => {

    try {

        const user = await UserModel.findOne({ userEmail: req.params.email });
        if (!user) {
            res.status(404).json({"message": "User was not found."});
            return;
        }
        
        if (!user.orders || user.orders.length == 0) {
            res.status(200).json({ "message": "You have no orders on your orders list" });
            return;
        }

        const order = user.orders.find(order => order._id == req.params.id);
        if (!order) {
            res.status(404).json({"message": "Order was not found."});
            return;
        }
        
        res.status(200).json(order);

    } catch(err) {
        res.sendStatus(404);
        console.log(err);
    }

});

router.get("/:id/seller", async (req, res) => {
    
    try {

        const user = await UserModel.findOne({ userEmail: req.params.email });
        if (!user) {
            res.status(404).json({"message": "User was not found."});
            return;
        }
        
        if (!user.orders || user.orders.length == 0) {
            res.status(200).json({ "message": "You have no orders on your orders list" });
            return;
        }

        const order = user.orders.find(order => order._id == req.params.id);
        if (!order) {
            res.status(404).json({"message": "Order was not found."});
            return;
        }

        const sellerEmail = order.seller;
        const seller = await UserModel.findOne({ userEmail: sellerEmail }).select({ name: 1, listings: 1, userEmail: 1, _id: 0 });
        if (!seller) {
            res.status(404).json({"message": "the given seller does not exist."});
            return;
        }

        res.status(200).json(seller);

    } catch(err) {
        res.sendStatus(500);
        console.log(err.message);
    }

});




module.exports = router;
