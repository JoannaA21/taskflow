require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//login
const login = async (req, res) => {
  res.json({ message: "Login" });
};
//logout
const logout = async (req, res) => {
  res.json({ message: "Logout" });
};

module.exports = {
  login,
  logout,
};
