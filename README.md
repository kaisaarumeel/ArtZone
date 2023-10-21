## Getting started

# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```

## System Definition (MS0)

### Purpose

Our system allows users, investors and art enthusiasts to buy and sell artwork online, for the purpose of investment, decoration or providing access to liquidity for current artwork owners. We differentiate from other online sales platforms such as eBay by specifically targeting the art market. By doing this, we allow our target audience to pinpoint the artwork that they are looking for through advanced filtering and sorting which would be deemed unfit for a more general exchange platform.

### Pages

* Login/Register page - An unregistered or not logged-in user can register or login to the website using an email and a password.
* Manage catalog (admin only) - Admins can remove listings if they are deemed unfit for the website.
* Manage users (admin only) - Admins can ban users if they are deemed unfit or have broken rules
* Add new listing - Users can create new listings of artworks.
* Manage orders - Users who have sold artworks can manage the order and mark it as processed or shipped when it is done.
* Single product - A single product page which shows pictures of the artwork and a thorough description of it.
* Product catalog - A list of listings where users can browse all the current available artworks.
* Checkout page - After interacting with the single product page users are redirected to checkout page to complete their order.
* Profile page - A page where users can edit their profile
* Home page - The landing page of the website, it has some information about the website.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/ERdiagram.png)

## Teaser (MS3)

![Teaser](./images/teaser.png)
