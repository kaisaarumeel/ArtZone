const mongoose = require("mongoose");
const express = require("express");
const router = express.Router({ "mergeParams": true });
const OrderModel = require("../models/orders.js");
const UserModel = require("../models/user.js");
const { createHash, randomUUID } = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');
const { Console } = require("console");

const pp_client = "AQAquHqyXLu-wDbXuWcL4hEKe-ay87Vco719EUZLpufXR1ouqoGkNCId9ZFAWM7Xef3H_UJ0vpZh5_hF";
const pp_secret = "EL03GoWvTdp-eVBu6l_OWEVe2ay083mqOqMvgk-dsBAQ2gA2niRvshNzDbZT9zx7m7Xj0etG0sg2a_xt";
const env = new paypal.core.SandboxEnvironment(pp_client, pp_secret);
const client = new paypal.core.PayPalHttpClient(env);

const { validateSellerEmail,
        getUser,
        getBuyerOrders,
        simulatePaypalCaptureRequest,
        makeHash,addOrder, 
        markOrderAsShipped, 
        markOrderAsReceived,
    findSellerListing } = require("../helper/order.helper.js")


router.post("/", async (req, res) => {

    try {

        //Finding user (buyer)
        const buyer = await getUser(req,res)
        const sellerEmail = await validateSellerEmail(req,res)
        //Finding seller
        if (sellerEmail === buyer.userEmail) return res.status(400).json({ "message": "You cannot buy your own art." })
        const seller = await UserModel.findOne({ userEmail: req.body.seller });
        if (!seller) {
            res.status(404).json({ "message": "User was not found." });
            return;
        }

        //Finding the listing of the seller
        const sellerListing=await findSellerListing(req,res,seller)
        const buyerOrders=await getBuyerOrders(req,res,buyer)
        

        let response = {
            "result": {
                "id": "0"
            }
        };
        await simulatePaypalCaptureRequest(req);
        

        sellerListing.sold = true;
        let hash=await makeHash(req);
        const paypalOrderId = response.result.id;
        await addOrder(seller,req,hash,paypalOrderId)
        await addOrder(buyer,req,hash,paypalOrderId)
        seller.save();
        buyer.save();

        return res.status(201).json(response.result);

    } catch (err) {
        res.sendStatus(500);
        console.log(err)
    }

});

router.get("/", async (req, res) => {
    try {
        const user = await getUser(req,res)
        if (!user.orders || user.orders.length == 0) {
            res.status(200).json({ "message": "You have no orders on your orders list" });
            return;
        }

        const links = new Array();
        for (let key of user.orders) {
            links.push({
                rel: "get specific order",
                method: "GET",
                href: `/users/${user.userEmail}/orders/${key._id}`
            });
        }

        return res.status(200).json({ orders: user.orders, links: links });
    } catch (err) {
        return res.sendStatus(500)
        console.log(err);
    }
});

router.delete("/:id", async (req, res) => {
    if (!req.auth.isAdmin) return res.sendStatus(403);
    try {
        const orderID = req.params.id;
        const userEmail = req.params.email;
        try {
            const result = await UserModel.findOneAndUpdate({ userEmail: userEmail }, { $pull: { orders: { _id: orderID } } });
            if (!result) {
                return res.status(404).json({ message: 'Listing not found' });
            }
            return res.sendStatus(204);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const user = await getUser(req,res)
        let order = user.orders.find(order => order._id == req.params.id);
        if (!order) {
            res.status(404).json({ "message": "Order was not found." });
            return;
        }
        for (let key in req.body) {
            if (order.seller === user.userEmail && key === 'isShipped') { //If user is attempting to ship an order
                await markOrderAsShipped(order,req,res,key,user)
            } else if (order.buyer === user.userEmail && key === 'isReceived') { //If user is attempting to mark order as received
                await markOrderAsReceived(order,req,res,key,user)
            } else {
                break;
            }
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await getUser(req,res)
        if (!user.orders 
            || user.orders.length == 0) return res.status(200).json({ "message": "You have no orders on your orders list" });
        
            const order = user.orders.find(order => order._id == req.params.id);
        if (!order) return res.status(404).json({ "message": "Order was not found." }); 

        return res.status(200).json(order);

    } catch (err) {
        return res.sendStatus(404);
        console.log(err);
    }

});

router.get("/:id/seller", async (req, res) => {
    try {
        const user = await getUser(req,res)
        if (!user.orders || user.orders.length == 0) return res.status(200).json({ "message": "You have no orders on your orders list" });

        const order = user.orders.find(order => order._id == req.params.id);
        if (!order) return res.status(404).json({ "message": "Order was not found." });

        const sellerEmail = order.seller;
        const seller = await UserModel.findOne({ userEmail: sellerEmail }).select({ name: 1, listings: 1, userEmail: 1, _id: 0 });
        if (!seller) return res.status(404).json({ "message": "the given seller does not exist." });

        return res.status(200).json(seller);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

module.exports = router;
