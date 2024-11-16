const Board = require("../models/boardModel");

// Get all boards for the logged-in user
const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user._id });
    if (boards.length == 0) {
      return res.status(404).json({ message: "No boards found." });
    }
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to retrieve boards.",
      details: err,
    });
  }
  //res.json({ message: "Get all boards" });
};

//Create a new project/board
const createBoard = async (req, res) => {
  try {
    const newBoard = await Board.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(newBoard);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to create a new board.",
      details: err,
    });
  }
  //res.json({ message: "Create a new board" });
};

//Get a specific project/board by ID
const getBoardById = async (req, res) => {
  //res.json({ message: "Get a specific project/board by ID" });
  const { id } = req.params;
  try {
    const board = await Board.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to retrieve board.",
      details: err,
    });
  }
};

//Update a project/board
const updateBoard = async (req, res) => {
  const { id } = req.params;
  try {
    const board = await Board.findOneAndUpdate(
      {
        userId: req.user._id, //ensures user is authorize
        _id: id, //Find a document where _id matches the value in req.params.id
      },
      req.body, //Contains the data to update the board with
      { new: true } //ensures the method returns the updated document after applying the changes specified in req.body
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to updating board.",
      details: err,
    });
  }
  //res.json({ message: "Update Board" });
};

//Delete a project/board
const deleteBoard = async (req, res) => {
  const { id } = req.params;
  try {
    const board = await Board.findOneAndDelete({
      userId: req.user._id,
      _id: id,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to delete board.",
      details: err,
    });
  }
  //res.json({ message: "Delete Board" });
};

module.exports = {
  getAllBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
};
