const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");
const User = require("../controllers/userController");
const Board = require("../controllers/boardController");
const Task = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authToken");
const {
  verifyBoardOwnership,
  verifyTaskOwnership,
} = require("../middleware/verifyOwnership");

router.post("/login", login);
router.get("/logout", logout);

//User Routes
router.post("/signup", User.createUser);
router.get("/users", User.getAllUser);
router.get("/users/:id", User.getUserById);
router.patch("/users/:id", User.updateUser);
router.delete("/users/:id", User.deleteUser);

//Board Routes
router.get("/boards", authenticateToken, Board.getAllBoards);
router.get("/boards/:id", authenticateToken, Board.getBoardById);
router.post("/boards", authenticateToken, Board.createBoard);
router.patch("/boards/:id", authenticateToken, Board.updateBoard);
router.delete("/boards/:id", authenticateToken, Board.deleteBoard);

//Task Routes
router.get(
  "/boards/:boardId/tasks",
  authenticateToken,
  verifyBoardOwnership,
  Task.getAllTaskFromBoard
);
router.post(
  "/boards/:boardId/tasks",
  authenticateToken,
  verifyBoardOwnership,
  Task.createTask
);
router.get(
  "/tasks/:taskId",
  authenticateToken,
  verifyTaskOwnership,
  Task.getTaskById
);
router.patch(
  "/tasks/:taskId",
  authenticateToken,
  verifyTaskOwnership,
  Task.updateTask
);
router.delete(
  "/tasks/:taskId",
  authenticateToken,
  verifyTaskOwnership,
  Task.deleteTask
);

module.exports = router;
