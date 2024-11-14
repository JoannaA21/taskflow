//Routes for Projects/Boards
const express = require("express");
const router = express.Router();

//Get all projects/boards for a user
router.get("/", (req, res) => {
  res.json({ message: "Get all boards" });
});

//Create a new project/board
router.post("/", (req, res) => {
  res.json({ message: "Create a new board" });
});

//Get a specific project/board by ID
router.get("/:id", (req, res) => {
  res.json({ message: "Get a specific project/board by ID" });
});

//Update a project/board
router.patch("/:id", (req, res) => {
  res.json({ message: "Update a board" });
});

//Delete a project/board
router.delete("/:id", (req, res) => {
  res.json({ message: "Delete a board by Id" });
});

module.exports = router;
