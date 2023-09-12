const mongoose = require("mongoose");
const express = require("express");
const router = express.Router({"mergeParams": true});
const OrderModel = require("../models/orders.js");
const UserModel = require("../models/user.js");
const Joi = require("joi");

router.post("/", async (req, res) => {

    try {

        const sellerEmail = String(req.body.seller);
        if (!sellerEmail.match(/.*@.*/)){
            res.status(400).json({ "message": "the provided seller information is not an email. you need to provide the seller's email"});
            return;
        }

        const seller = UserModel.findOne({ userEmail: sellerEmail });
        if (!seller) {
            res.status(404).json({"message": "the given seller does not exist."});
            return;
        }

        const newOrder = new OrderModel.model({
            seller: req.body.seller,
        });

        const user = await UserModel.findOneAndUpdate({ userEmail: req.params.email },
             { $push: { orders: newOrder } })
        if (!user) {
            res.status(404).json({"message": "User was not found."});
            return;
        }
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

        if (!user.orders) {
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

        const order = user.order.find(orderId => orderId == req.params.id);
        if (!order) {
            res.status(404).json({"message": "Order was not found."});
            return;
        }

        const { error } = validateOrder(req.body);
        if (error) {
            res.status(400).json({"message": error.details[0].message})
            return;
        }

        user.save();
        res.status(200);

    } catch(err) {
        res.sendStatus(500);
        console.log(err.message);
    }

});

router.get("/:id", async (req, res) => {

    try {

        const user = await UserModel.find({ userEmail: req.params.email });
        if (!user) {
            res.status(404).json({"message": "User was not found."});
            return;
        }

        if (!user.orders) {
            res.status(200).json({ "message": "You have no orders on your orders list" });
            return;
        }

        const order = user.order.find(orderId => orderId == req.params.id);
        if (!order) {
            res.status(404).json({"message": "Order was not found."});
            return;
        }
        
        res.status(200).json({ "orders": order });

    } catch(err) {
        res.sendStatus(404);
        console.log(err.message);
    }

});

router.get("/:id/seller", async (req, res) => {

    try {

        const user = await UserModel.find({ userEmail: req.params.email });
        if (!user) {
            res.status(404).json({"message": "User was not found."});
            return;
        }

        if (!user.orders) {
            res.status(200).json({ "message": "You have no orders on your orders list" });
            return;
        }

        const order = user.order.find(orderId => orderId == req.params.id);
        if (!order) {
            res.status(404).json({"message": "Order was not found."});
            return;
        }

        const sellerEmail = order.seller;
        const seller = UserModel.findOne({ userEmail: sellerEmail });
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

function validateOrder(req) {
    for (key in req) {
        if (key == "isReceived") {
            const schema = Joi.object({
                isReceived: Joi.boolean().required()
            });
            return schema.validate(req);
        }
    }
    
}

module.exports = router;
