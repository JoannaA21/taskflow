// routes/taskRoutes.js
const express = require("express");
const router = express.Router();

// Get all tasks in a specific project
router.get("/boards/:boardId/tasks", (req, res) => {
  res.json({ message: `Get all tasks for project ID ${req.params.projectId}` });
});

// Create a task in a specific project
router.post("/boards/:boardId/tasks", (req, res) => {
  res.json({
    message: `Create a new task for project ID ${req.params.projectId}`,
  });
});

// Get a specific task by task ID
router.get("/tasks/:taskId", (req, res) => {
  res.json({ message: `Get task with ID ${req.params.taskId}` });
});

// Update a specific task by task ID
router.patch("/tasks/:taskId", (req, res) => {
  res.json({ message: `Update task with ID ${req.params.taskId}` });
});

// Delete a specific task by task ID
router.delete("/tasks/:taskId", (req, res) => {
  res.json({ message: `Delete task with ID ${req.params.taskId}` });
});

module.exports = router;
