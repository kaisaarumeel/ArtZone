const express = require('express');
const path = require('path');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const morgan = require('morgan');
const mongoose = require("mongoose");

//instances of the schema. Pay attention that the methods that are used to query and save instances
//work asynchronously.
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/art-exchange';
const UserModel =require("./models/user")
// Connect to MongoDB
mongoose.connect(mongoURI).catch(function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

const listings = require("./controllers/listings.controller.js")
const listingsPage = require("./controllers/listings.page.controller.js")
const users=require("./controllers/users");
const session = require('./middleware/session');
const port = process.env.PORT || 3000;



// Create Express app
const app = express();
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());
app.use(session);
app.use("/api/v1/users",users);
app.use("/api/v1/users/:email/listings", listings);
app.use("/api/v1/listings/page/:page", listingsPage);


// Import routes
/*app.get('/api', function(req, res) {
    res.json({'message': 'Welcome to your DIT342 backend ExpressJS project!'});
});*/



app.get('/api', function(req, res) {
    res.json({'message': 'Welcome to your DIT342 backend ExpressJS project!'});
});

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
const root = path.normalize(__dirname + '/..');
const client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
const env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    const err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
    const present=UserModel.findOne({isAdmin:true})
    .then((result)=>{
        if(result!=null) return;
        console.log("No admin account present... Generating new admin account.");
        const admin=new UserModel({
            name: {
                firstName:"Bob",
                lastName:"Bobson"
            },
            address:{
                country:"Sweden",
                street:"Bob street 1",
                zip:"12345",
                city:"Bobtown"
            },
            dateOfBirth: "2002-03-24",
            password: "81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce9",
            verificationStatus: true,
            userEmail: "bob@gmail.com",
            isAdmin: true,
            listings: [],
            orders: [],
            reviews: [] 
        });
        admin.validateSync()
        UserModel.collection.insertOne(admin);
    })
    .catch((err)=>{
        console.log("Failed talking to database.")
        console.error(err);
    })
});

module.exports = app;
