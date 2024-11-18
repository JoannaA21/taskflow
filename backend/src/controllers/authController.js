require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const bcrypt = require("bcrypt");

//login
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Username or email does not exist.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password", password);
    console.log("User_password", user.password);
    console.log(isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email/username or password. Please try again.",
      });
    }

    //Payload for token
    const decode = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    //console.log("signing payload", decode);
    const token = jwt.sign(decode, process.env.ACCESS_SECRET_KEY, {
      expiresIn: "1h",
    });

    const details = {
      details: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: token,
    };

    res.json({ details });
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

//Logout not implemented
