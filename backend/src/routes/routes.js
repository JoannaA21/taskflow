const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");
const User = require("../controllers/userController");
const Board = require("../controllers/boardController");
const Task = require("../controllers/taskController");

router.post("/login", login);
router.get("/logout", logout);

//User Routes
router.post("/signup", User.createUser);
router.get("/users", User.getAllUser);
router.get("/users/:id", User.getUserById);
router.patch("/users/:id", User.updateUser);
router.delete("/users/:id", User.deleteUser);

//Board Routes
router.get("/boards", Board.getAllBoards);
router.get("/boards/:id", Board.getBoardById);
router.post("/boards", Board.createBoard);
router.patch("/boards/:id", Board.updateBoard);
router.delete("/boards/:id", Board.deleteBoard);

//Task Routes
router.get("/boards/:boardId/tasks", Task.getAllTaskFromBoard);
router.get("/tasks/:taskId", Task.getTaskById);
router.post("/boards/:boardId/tasks", Task.createTask);
router.patch("/tasks/:taskId", Task.updateTask);
router.delete("/tasks/:taskId", Task.deleteTask);

module.exports = router;