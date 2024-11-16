const Board = require("../models/boardModel");
const Task = require("../models/taskModel");

const verifyBoardOwnership = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.user._id,
    });
    if (!board) {
      return res.status(403).json({ message: "Unauthorized access to board." });
    }
    next();
  } catch (err) {
    res.status(500).json({
      error: err.message || "Internal server error.",
      details: err,
    });
  }
};

const verifyTaskOwnership = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure the board associated with the task belongs to the user
    const board = await Board.findOne({
      _id: task.boardId,
      userId: req.user._id,
    });
    if (!board) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to the task's board" });
    }

    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to verify task ownership", error: err });
  }
};

module.exports = {
  verifyBoardOwnership,
  verifyTaskOwnership,
};
