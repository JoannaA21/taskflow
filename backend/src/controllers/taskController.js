const Task = require("../models/taskModel");

// Get all tasks in a specific project
const getAllTaskFromBoard = async (req, res) => {
  //route = boards/:boardId/tasks
  try {
    const tasks = await Task.find({ boardId: req.params.boardId });

    // if (tasks.length === 0) {
    //   return res.status(404).json({ message: "No tasks found." });
    // }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to retrieve tasks.",
      details: err,
    });
  }
  //res.json({ message: "Get all tasks for project ID" });
};

// Create a task in a specific project
const createTask = async (req, res) => {
  //boards/:boardId/tasks
  try {
    const newTask = await Task.create({
      ...req.body,
      boardId: req.params.boardId,
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to create task.",
      details: err,
    });
  }
  //res.json({ message: "Create a new task for project ID" });
};

// Get a specific task by task ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to retrieve task.",
      details: err,
    });
  }
  //res.json({ message: "Get task with ID" });
};

// Update a specific task by task ID
const updateTask = async (req, res) => {
  //tasks/:taskId
  try {
    const task = await Task.findByIdAndUpdate(
      {
        _id: req.params.taskId,
      },
      req.body,
      { new: true } //ensures the method returns the updated document after applying the changes specified in req.body
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to update task.",
      details: err,
    });
  }
  //res.json({ message: "Update task with ID" });
};

// Delete a specific task by task ID
const deleteTask = async (req, res) => {
  ///tasks/:taskId
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to delete task.",
      details: err,
    });
  }
  //res.json({ message: "Delete task with ID " });
};

module.exports = {
  getAllTaskFromBoard,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
