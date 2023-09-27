// wiki.js - Wiki route module.
const UserSchema = require("../models/user"); //this is the schema class. Use this class to make 
const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router({mergeParams:true});
const session = require("../middleware/session")
router.get('/page/:page', async (req, res) => {
    try {
      const page = parseInt(req.params.page || 1); // Requested page number

      const perPage = 6; // Number of users per page 
      const skip = (page - 1) * perPage;
  
      // Find all users
      let users = await UserSchema.find();
      if (!users) return res.status(200).json({"message": "no users are in the system."});

      let sanitized_users=[]
      for(let i=0;i<users.length;i++){
        let sanitized_user=JSON.parse(JSON.stringify(users[i]));
        delete sanitized_user["listings"];
        delete sanitized_user["password"];
        delete sanitized_user["session"];
        console.log(sanitized_user)
        sanitized_users.push(sanitized_user)
      }

        users = sanitized_users.slice(skip, skip + perPage);
      const totalPages = Math.ceil(sanitized_users.length / perPage);
      const hasNextPage = page < totalPages;
  
      res.status(200).json({
        users,
        page,
        totalPages,
        hasNextPage,
      });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

module.exports = router;
