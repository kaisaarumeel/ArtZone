// wiki.js - Wiki route module.
const express = require("express");
const router = express.Router({ mergeParams: true });
const { generatePage } = require("../helper/user.page.helper");
router.get('/page/:page', async (req, res) => {
  if (!req.auth.isAdmin) return res.sendStatus(403);

  try {
    const page = parseInt(req.params.page || 1); // Requested page number

    const perPage = 6; // Number of users per page 
    const skip = (page - 1) * perPage;

    // Find all users
    let result;
    try {
      result = await generatePage(skip, perPage)
    } catch (err) {
      return res.status(404).json({ "message": "No users in system" });
    }
    let users = result.users;
    let sanitized_users = result.sanitized_users;

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
