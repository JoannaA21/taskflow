const User = require("../models/userModel");

const bcrypt = require("bcrypt");

//Get all user
const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No existing users." });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  // res.json({ message: "Get all user" });
};

//Get user by Id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    res.status(500).json({
      error: err.message || "Failed to retrieve user by Id.",
      details: err,
    });
  }
  // res.json({ message: "Get user by id" });
};

//Create a new user
const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  //res.json({ message: "Create new user" });
};

//Update a user by Id
const updateUser = async (req, res) => {
  // res.json({ message: "Update user" });
};

//Delete a user by Id
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(204).json({ message: "User has been deleted!" });
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to delete user by Id.",
      details: err,
    });
  }
  //res.json({ message: "Delete user" });
};

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

//Update is not implemented
// I don't know what can be updated with the user profile yet!
