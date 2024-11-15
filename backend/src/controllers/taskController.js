const Task = require("../models/taskModel");

// Get all tasks in a specific project
const getAllTaskFromBoard = async (res, req) => {
  res.json({ message: "Get all tasks for project ID" });
};
// Create a task in a specific project
const createTask = async (res, req) => {
  res.json({ message: "Create a new task for project ID" });
};
// Get a specific task by task ID
const getTaskById = async (res, req) => {
  res.json({ message: "Get task with ID" });
};
// Update a specific task by task ID
const updateTask = async (res, req) => {
  res.json({ message: "Update task with ID" });
};
// Delete a specific task by task ID
const deleteTask = async (res, req) => {
  res.json({ message: "Delete task with ID " });
};

module.exports = {
  getAllTaskFromBoard,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
