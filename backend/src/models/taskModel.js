const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: "Task", // Self-reference for sub-tasks
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board", //reference to Board
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
