const {
  verifyBoardOwnership,
  verifyTaskOwnership,
} = require("../middleware/verifyOwnership");
const Board = require("../models/boardModel");
const Task = require("../models/taskModel");

jest.mock("../models/boardModel");
jest.mock("../models/taskModel");

describe("Verify Ownership Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: {
        boardId: "board123",
        taskId: "task123",
      },
      user: {
        _id: "user123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("Verify Board Ownership", () => {
    it("should call next() if user owns the board", async () => {
      Board.findOne.mockResolvedValue({ _id: "board123", userId: "user123" });
      await verifyBoardOwnership(req, res, next);
      expect(Board.findOne).toHaveBeenCalledWith({
        _id: "board123",
        userId: "user123",
      });
      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if user does not own the board", async () => {
      Board.findOne.mockResolvedValue(null);
      await verifyBoardOwnership(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized access to board.",
      });
    });

    it("should return 500 if there's an internal error", async () => {
      Board.findOne.mockRejectedValue(new Error("Internal server error."));
      await verifyBoardOwnership(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Internal server error.",
        }),
      );
    });
  });

  describe("Verify Task Ownership", () => {
    it("should call next() if user owns the TASK", async () => {
      Task.findById.mockResolvedValue({ _id: "task123", boardId: "board123" });
      Board.findOne.mockResolvedValue({
        _id: "board123",
        userId: "user123",
      });
      await verifyTaskOwnership(req, res, next);
      expect(Task.findById).toHaveBeenCalledWith("task123");
      expect(Board.findOne).toHaveBeenCalledWith({
        _id: "board123",
        userId: "user123",
      });

      expect(next).toHaveBeenCalled();
    });

    it("should return 404 if task is not found", async () => {
      Task.findById.mockResolvedValue(null);
      await verifyTaskOwnership(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task not found",
      });
    });

    it("should return 403 if user does not own the task's board", async () => {
      Task.findById.mockResolvedValue({
        _id: "task123",
        boardId: "board123",
      });
      Board.findOne.mockResolvedValue(null);
      await verifyTaskOwnership(req, res, next);
      expect(Board.findOne).toHaveBeenCalledWith({
        _id: "board123",
        userId: "user123",
      });
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized access to the task's board",
      });
    });

    it("should return 500 if there's an internal error", async () => {
      Task.findById.mockRejectedValue(
        new Error("Failed to verify task ownership"),
      );
      await verifyTaskOwnership(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to verify task ownership",
        }),
      );
    });
  });
});
