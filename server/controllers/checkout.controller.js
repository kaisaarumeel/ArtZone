const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router({mergeParams:true});
const paypal = require('@paypal/checkout-server-sdk');

const pp_client="AQAquHqyXLu-wDbXuWcL4hEKe-ay87Vco719EUZLpufXR1ouqoGkNCId9ZFAWM7Xef3H_UJ0vpZh5_hF";
const pp_secret="EL03GoWvTdp-eVBu6l_OWEVe2ay083mqOqMvgk-dsBAQ2gA2niRvshNzDbZT9zx7m7Xj0etG0sg2a_xt";
const env = new paypal.core.SandboxEnvironment(pp_client, pp_secret);
const client = new paypal.core.PayPalHttpClient(env);


router.post("/",async (req,res)=>{
  if(!req.auth.auth) return res.sendStatus(403);

  try{
    const buyer = await UserSchema.findOne({userEmail:req.body.buyer});
    if (!buyer) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = await UserSchema.findOne({userEmail:req.body.email});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Get the listing with the given name
    const foundListing = user.listings.find(listing => listing.id ===  req.body.id);

    if (!foundListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
              "description": "ArtExchange: "+foundListing.name,
                "amount": {
                    "currency_code": "SEK",
                    "value": (foundListing.price).toString()
                },
                "payee": {
                    "email_address": req.body.email
                },
                "shipping": {
                  "name": {
                      "full_name": buyer.name.firstName+" "+buyer.name.lastName
                  },
                  "address": {
                      "address_line_1": buyer.address.street,
                      "address_line_2": "",
                      "admin_area_2": buyer.address.city,
                      "admin_area_1": "",
                      "postal_code": buyer.address.zip,
                      "country_code": buyer.address.country
                  }
              }
            }
        ]
    });

    const createOrder = async function () {
        const response = await client.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);
        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        console.log(`Order: ${JSON.stringify(response.result)}`);
        return res.status(201).json(response.result);
    };
    createOrder();

  } catch(err) {
    console.log(err)
    return res.sendStatus(500);
  }

})


module.exports=router;