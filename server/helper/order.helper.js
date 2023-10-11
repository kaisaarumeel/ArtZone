const OrderModel = require("../models/orders.js");
const UserModel = require("../models/user.js");
const { createHash, randomUUID } = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');





async function getUser(req,res){
    const user = await UserModel.findOne({ userEmail: req.params.email });
    if (!user) {
        res.status(404).json({ "message": "User was not found." });
        return;
    }
    return user;
}

async function validateSellerEmail(req,res){
    const sellerEmail = String(req.body.seller);
    //we use regx here to confirm that the email is of the right format.
    if (!sellerEmail.match(/.*@.*/)) {
        res.status(400).json({ "message": "The provided seller information is not an email. You need to provide the seller's email" });
        return;
    }
    return sellerEmail;
}


async function findSellerListing(req,res,seller){
    let sellerListing = seller.listings.find(listing => listing.id === req.body.listing);
    if (!sellerListing) {
        res.status(400).json({ "message": "The seller does not posses the listing you want to order" });
        return;
    }
    return sellerListing;
}

async function getBuyerOrders(req,res,buyer){
    const buyerOrders = buyer.orders;
    if (buyerOrders) {
        //user cannot the same listing from the seller.
        const sameOrder = buyerOrders.find(order => order.listing === req.body.listing && order.seller === req.body.seller);
        if (sameOrder) {
            res.status(403).json({ "message": "You have already ordered the following listing." });
            return;
        }
    }
    return buyerOrders
}

async function simulatePaypalCaptureRequest(req){
    if (!req.body.simulate) {
        request = new paypal.orders.OrdersCaptureRequest(req.body.paypalOrderId);
        request.requestBody({});
        response = await client.execute(request);
    }
}

async function addOrder(user,req,hash,paypalOrderId){
    user.orders.push(new OrderModel.model({
        seller: req.body.seller,
        buyer: req.params.email,
        listing: req.body.listing,
        hash: hash,
        isReceived: false,
        isShipped: false,
        paypalOrderId: paypalOrderId
    }));
}
async function makeHash(req){

    let msg = Date.now().toString() + req.body.seller + req.params.email + req.body.listing + randomUUID();
    let hash = await createHash('sha256').update(msg).digest('hex');
    return hash;
}

async function markOrderAsShipped(order,req,res,key,user){
    if (order.isReceived === true) {
        return res.status(403).json({ "message": "You cannot change the shipping status of an order that is received by the buyer" });

    } else {

        const buyer = await UserModel.findOne({ userEmail: req.body.buyer });
        if (!buyer) {
            res.status(404).json({ "message": "Buyer was not found." });
            return;
        }

        order[key] = req.body[key];
        try {
            const error = await order.validate()
        } catch (err) {
            return res.status(400).json({ "message": "Order validation failed" });
        }

        let buyerOrder = buyer.orders.find(buyerOder => buyerOder.hash === order.hash);
        if (!buyerOrder) {
            res.status(404).json({ "message": "Buyer order was not found." });
            return;
        }
        buyerOrder[key] = req.body[key]

        await user.save();
        await buyer.save();
        res.sendStatus(200);
        return

    }
}

async function markOrderAsReceived(order,req,res,key,user) {

    if (order.isShipped === true) {

        const seller = await UserModel.findOne({ userEmail: req.body.seller });
        if (!seller) {
            res.status(404).json({ "message": "Seller was not found." });
            return;
        }

        let sellerListing = seller.listings.find(listing => listing.id == order.listing);
        if (!sellerListing) {
            res.status(404).json({ "message": "Seller Listing was not found." });
            return;
        }

        order[key] = req.body[key];
        try {
            const error = await order.validate()
        } catch (err) {
            return res.status(400).json({ "message": "Order validation failed" });
        }

        let sellerOrder = seller.orders.find(sellerOrder => sellerOrder.hash === order.hash);
        if (!sellerOrder) {
            res.status(404).json({ "message": "Seller order was not found." });
            return;
        }
        sellerOrder[key] = req.body[key]

        seller.listings = seller.listings.filter(listing => listing._id !== sellerListing._id);
        await seller.save();

        //removing the listing from the seller's listings and adding it to the buyer's listings
        await UserModel.findOneAndUpdate({ userEmail: req.params.email }, { $push: { listings: sellerListing } }, { new: true });


        await user.save();

        return res.sendStatus(200);


    } else {
        return res.status(403).json({ "message": "You need to wait for your order to be shipped" });
    }
}

module.exports={findSellerListing, markOrderAsReceived,markOrderAsShipped, getUser, validateSellerEmail,getBuyerOrders,simulatePaypalCaptureRequest,makeHash,addOrder}