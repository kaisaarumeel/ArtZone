const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router({ mergeParams: true });
const paypal = require('@paypal/checkout-server-sdk');

const pp_client = "AQAquHqyXLu-wDbXuWcL4hEKe-ay87Vco719EUZLpufXR1ouqoGkNCId9ZFAWM7Xef3H_UJ0vpZh5_hF";
const pp_secret = "EL03GoWvTdp-eVBu6l_OWEVe2ay083mqOqMvgk-dsBAQ2gA2niRvshNzDbZT9zx7m7Xj0etG0sg2a_xt";
const env = new paypal.core.SandboxEnvironment(pp_client, pp_secret);
const client = new paypal.core.PayPalHttpClient(env);

const { getUserByEmail } = require("../helper/general.helper");
const { createOrderRequest } = require("../helper/checkout.helper");

router.post("/", async (req, res) => {
  if (!req.auth.auth) return res.sendStatus(403);

  try {
    let buyer, user;
    try {
      buyer = await getUserByEmail(req.body.buyer);
      user = await getUserByEmail(req.body.email);
    } catch (err) {
      return res.sendStatus(404);
    }
    // Get the listing with the given name
    const foundListing = user.listings.find(listing => listing.id === req.body.id);
    if (!foundListing) return res.status(404).json({ message: 'Listing not found' });

    const request = await createOrderRequest(foundListing,
      req.body.email,
      buyer.name.firstName,
      buyer.name.lastName,
      buyer.address.street,
      buyer.address.city,
      buyer.address.zip,
      buyer.address.country)
    const response = await client.execute(request);
    return res.status(201).json(response.result);
  } catch (err) {
    console.log(err)
    return res.sendStatus(500);
  }

})


module.exports = router;