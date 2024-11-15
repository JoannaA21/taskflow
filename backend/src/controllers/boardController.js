const Board = require("../models/boardModel");

//Get all projects/boards for a user
const getAllBoards = async (req, res) => {
  //res.json({ message: "Get all boards" });
};
//Create a new project/board
const createBoard = async (req, res) => {
  res.json({ message: "Create a new board" });
};
//Get a specific project/board by ID
const getBoardById = async (req, res) => {
  res.json({ message: "Get a specific project/board by ID" });
};
//Update a project/board
const updateBoard = async (req, res) => {
  res.json({ message: "Update Board" });
};
//Delete a project/board
const deleteBoard = async (req, res) => {
  res.json({ message: "Delete Board" });
};

module.exports = {
  getAllBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
};
