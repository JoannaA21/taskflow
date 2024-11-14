//Authentication routes
const express = require("express");
const router = express.Router();

//Register a new user
router.post("/signup", (req, res) => {
  res.json({ message: "authentication signup" });
});

//Log in a user and return a JWT
router.post("/login", (req, res) => {
  res.json({ message: "authentication login" });
});

//Log out the user (clear JWT on client)
router.post("/logout", (req, res) => {
  res.json({ message: "authentication logout" });
});

module.exports = router;
