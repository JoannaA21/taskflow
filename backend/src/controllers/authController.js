require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SECRET_KEY = process.env.SECRET_KEY;

const bcrypt = require("bcrypt");

//login
const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or email.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password", password);
    console.log("User_password", user.password);
    console.log(isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message || "An error occurred while logging in.",
      details: err,
    });
  }
  //res.json({ message: "Login" });
};
//logout
const logout = async (req, res) => {
  res.json({ message: "Logout" });
};

module.exports = {
  login,
  logout,
};
