const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task", //reference to Task model
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
