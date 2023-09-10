// wiki.js - Wiki route module.

const express = require("express");
const router = express.Router();
const register = require("../middleware/register")
const login = require("../middleware/login")
// Home page route.
router.post("/login", login, function (req, res) {
    if(req.status==200){
        res.json({key:req.key});
    } else {
        res.sendStatus(req.status);
    }});

router.post("/register",register, function (req, res) {
    res.sendStatus(req.status);
  });


module.exports = router;
