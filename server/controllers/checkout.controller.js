const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router({mergeParams:true});
const stripe = require("stripe")('sk_test_51NpDadKO47ufOaktcKjrqDxIMwUzvpWbLT3k7qybo1oi36JHQR2aclSZohKmmG540aPDjT3NHyoH0AacNdduihlp00KQ30IXG2');
//Untestable at the moment
const calculateOrderAmount = (items) => {
    return 1400;
  };

router.post("/",async (req,res)=>{
    const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sek",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
})
module.exports=router;