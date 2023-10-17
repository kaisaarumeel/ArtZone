const OrderModel = require("../models/orders.js");
const UserModel = require("../models/user.js");
const { createHash, randomUUID } = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');




async function findSellerListing(req, res, seller) {
    let sellerListing = seller.listings.find(listing => listing.id === req.body.listing);
    if (!sellerListing) {
        throw new Error("Listing does not exist")
    }
    return sellerListing;
}



async function capturePayment(req, response, client) {
    if (!req.body.simulate) {
        request = new paypal.orders.OrdersCaptureRequest(req.body.paypalOrderId);
        request.requestBody({});
        response = await client.execute(request);
    }
    return response
}

async function addOrder(user, req, hash, paypalOrderId) {
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
async function makeHash(req) {

    let msg = Date.now().toString() + req.body.seller + req.params.email + req.body.listing + randomUUID();
    let hash = await createHash('sha256').update(msg).digest('hex');
    return hash;
}

async function markOrderAsShipped(order, req, res, key, user) {
    if (order.isReceived === true) {
        return 403;
    } else {

        const buyer = await UserModel.findOne({ userEmail: req.body.buyer });
        if (!buyer) {
            return 404;
        }

        order[key] = req.body[key];
        try {
            const error = await order.validate()
        } catch (err) {
            return 400;
        }
        let buyerOrder = buyer.orders.find(buyerOrder => buyerOrder.hash === order.hash);
        if (!buyerOrder) {
            return 404;
        }
        buyerOrder[key] = req.body[key]

        await user.save();
        await buyer.save();
        return 200;

    }
}

async function markOrderAsReceived(order, req, res, key, user) {

    if (order.isShipped === true) {
        const seller = await UserModel.findOne({ userEmail: req.body.seller });
        if (!seller) {
            return 404;
        }

        let sellerListing = seller.listings.find(listing => listing.id == order.listing);
        if (!sellerListing) {
            return 404;
        }

        order[key] = req.body[key];
        try {
            const error = await order.validate()
        } catch (err) {
            return 400;
        }

        let sellerOrder = seller.orders.find(sellerOrder => sellerOrder.hash === order.hash);
        if (!sellerOrder) {
            return 404;
        }
        sellerOrder[key] = req.body[key]
        seller.listings = seller.listings.filter(listing => listing._id !== sellerListing._id);
        seller.orders = seller.orders.filter(order => order._id !== sellerOrder._id);
        user.orders = user.orders.filter(userOrder => userOrder._id !== order._id);
        await seller.save();
        await user.save();
        return 200;

    } else {
        return 403;
    }
}

module.exports = { findSellerListing, markOrderAsReceived, markOrderAsShipped, capturePayment, makeHash, addOrder }