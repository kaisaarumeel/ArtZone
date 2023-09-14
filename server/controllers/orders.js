const mongoose = require("mongoose");
const express = require("express");
const router = express.Router({"mergeParams": true});
const OrderModel = require("../models/orders.js");
const UserModel = require("../models/user.js");
const Joi = require("joi");

//posting an order on the database
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

        const sellerListing = seller.listings.find(listing => listing.name = req.body.listing);
        if (!sellerListing) {
            res.status(403).json({"message": "The seller does not posses the listing you want to order"});
            return;
        }

        if (seller.userEmail === user.userEmail) {
            res.status(403).json({"message": "You cannot buy your own art."})
            return;
        }

        const userOrders = user.orders;
        if (userOrders) {
            console.log("hey");
            //user cannot the same listing from the seller.
            const sameOrder = userOrders.find(order =>  order.listing === req.body.listing && order.seller === req.body.seller);
            if (sameOrder) {
                res.status(400).json({"message": "You have already ordered the following listing."});
                return;
            }
        }
        const newOrder = new OrderModel.model({
            seller: req.body.seller,
            listing: req.body.listing
        });
        
        user.orders.push(newOrder);
        user.save();

        res.sendStatus(201);

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
        res.status(200).json({ "orders": user.orders});

    } catch(err) {
        res.sendStatus(500)
        console.log(err);
    }

});

router.patch("/:id", async (req, res) => {

    try {

        const user = await UserModel.findOne({ userEmail: req.params.email });
        if (!user) {
            res.status(404).json({"message": "User was not found."});
            return;
        }  

        console.log(req.params.id);
        console.log(user.orders[0].orderId);

        const order = user.orders.find(order => order.orderId == req.params.id);
        if (!order) {
            res.status(404).json({"message": "Order was not found."});
            return;
        }

        const { error } = validateOrder(req.body);
        if (error) {
            res.status(400).json({"message": error.details[0].message})
            return;
        }

        order.isReceived = req.body.isReceived;
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

        const order = user.orders.find(order => order.orderId == req.params.id);
        if (!order) {
            res.status(404).json({"message": "Order was not found."});
            return;
        }
        
        res.status(200).json({ "order": order });

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

        const order = user.orders.find(order => order.orderId == req.params.id);
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

        res.status(200).json({ "seller": seller});

    } catch(err) {
        res.sendStatus(500);
        console.log(err.message);
    }

});

// Joi is used for validation
function validateOrder(body) {
    
    const schema = Joi.object({
        isReceived: Joi.boolean().required(),
        seller: Joi.string(),
        orderId: Joi.string(),
        listing: Joi.string()
    });
    return schema.validate(body);
     
}

module.exports = router;
