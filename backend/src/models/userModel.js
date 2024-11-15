const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //creates a createdAt which outputs a date when the user was created
  }
);

//Creates a User collection that we can interact with throughout our code
const User = mongoose.model("User", userSchema);

module.exports = User;
