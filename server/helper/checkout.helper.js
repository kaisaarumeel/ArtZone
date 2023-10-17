const paypal = require('@paypal/checkout-server-sdk');

async function createOrderRequest(listing, email, firstName, lastName, street, city, zip, country) {
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    "intent": "CAPTURE",
    "purchase_units": [
      {
        "description": "ArtExchange: " + listing.name,
        "amount": {
          "currency_code": "SEK",
          "value": (listing.price).toString()
        },
        "payee": {
          "email_address": email
        },
        "shipping": {
          "name": {
            "full_name": firstName + " " + lastName
          },
          "address": {
            "address_line_1": street,
            "address_line_2": "",
            "admin_area_2": city,
            "admin_area_1": "",
            "postal_code": zip,
            "country_code": country
          }
        }
      }
    ]
  });
  return request;
}

module.exports = {
  createOrderRequest
}