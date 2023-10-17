const express = require("express");
const router = express.Router({ "mergeParams": true });
const UserModel = require("../models/user.js");
const paypal = require('@paypal/checkout-server-sdk');

const pp_client = "AQAquHqyXLu-wDbXuWcL4hEKe-ay87Vco719EUZLpufXR1ouqoGkNCId9ZFAWM7Xef3H_UJ0vpZh5_hF";
const pp_secret = "EL03GoWvTdp-eVBu6l_OWEVe2ay083mqOqMvgk-dsBAQ2gA2niRvshNzDbZT9zx7m7Xj0etG0sg2a_xt";
const env = new paypal.core.SandboxEnvironment(pp_client, pp_secret);
const client = new paypal.core.PayPalHttpClient(env);

const {
    capturePayment,
    makeHash, addOrder,
    markOrderAsShipped,
    markOrderAsReceived,
    findSellerListing,
} = require("../helper/order.helper.js");
const { validateEmail, getUserByEmail } = require("../helper/general.helper.js");

router.post("/", async (req, res) => {

    try {

        //Finding user (buyer)
        let buyer;
        try {
            buyer = await getUserByEmail(req.params.email)
        } catch (err) {
            return res.sendStatus(404);
        }
        const sellerEmail = req.body.seller;
        //Ensure seller email is a valid email
        try {
            await validateEmail(sellerEmail, res)
        } catch (err) {
            res.status(400).json({ "message": "Invalid email provided" });
        }
        //Finding seller
        if (sellerEmail === buyer.userEmail) return res.status(400).json({ "message": "You cannot buy your own art." })
        let seller;
        try {
            seller = await getUserByEmail(req.body.seller)
        } catch (err) {
            return res.sendStatus(404);
        }
        //Finding the listing of the seller
        let sellerListing;
        try {
            sellerListing = await findSellerListing(req, res, seller)
        } catch (err) {
            return res.status(404).json({ "message": "The seller does not posses the listing you want to order" });
        }
        //Validating order
        const sameOrder = buyer.orders.find(order => order.listing === req.body.listing && order.seller === req.body.seller);
        if (sameOrder) return res.status(403).json({ "message": "You have already ordered the following listing." });
        let response = {
            "result": {
                "id": "0"
            }
        };
        //Capture paypal payment
        response = await capturePayment(req, response, client);

        //Mark listing as sold
        sellerListing.sold = true;
        //Generate a unique hash for this order
        let hash = await makeHash(req);

        const paypalOrderId = response.result.id;

        //Add the order to both the seller and buyer profile
        await addOrder(seller, req, hash, paypalOrderId)
        await addOrder(buyer, req, hash, paypalOrderId)
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
        let user;
        try {
            user = await getUserByEmail(req.params.email)
        } catch (err) {
            return res.sendStatus(404);
        }

        //HATEOAS
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
        console.log(err);
        return res.sendStatus(500)
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
        let user;
        try {
            user = await getUserByEmail(req.params.email)
        } catch (err) {
            console.log(err)
            return res.sendStatus(404);
        }
        let order = user.orders.find(order => order.id === req.params.id);
        if (!order) {
            res.status(404).json({ "message": "Order was not found." });
            return;
        }
        for (let key in req.body) {
            if (order.seller === user.userEmail && key === 'isShipped') { //If user is attempting to ship an order
                let status = await markOrderAsShipped(order, req, res, key, user)
                return res.sendStatus(status)

            } else if (order.buyer === user.userEmail && key === 'isReceived') { //If user is attempting to mark order as received
                let status = await markOrderAsReceived(order, req, res, key, user)
                return res.sendStatus(status)
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
        let user;
        try {
            user = await getUserByEmail(req.params.email)
        } catch (err) {
            return res.sendStatus(404);
        }
        if (!user.orders
            || user.orders.length == 0) return res.status(404).json({ "message": "You have no orders on your orders list" });

        const order = user.orders.find(order => order._id == req.params.id);
        if (!order) return res.status(404).json({ "message": "Order was not found." });

        return res.status(200).json(order);

    } catch (err) {
        console.log(err);
        return res.sendStatus(404);
    }

});

router.get("/:id/seller", async (req, res) => {
    try {
        let user;
        try {
            user = await getUserByEmail(req.params.email)
        } catch (err) {
            return res.sendStatus(404)
        }
        if (!user.orders || user.orders.length == 0) return res.status(404).json({ "message": "You have no orders on your orders list" });

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
