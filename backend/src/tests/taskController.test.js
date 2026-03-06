const {
  getAllTaskFromBoard,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const Task = require("../models/taskModel");

jest.mock("../models/taskModel");

describe("Task Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: {
        boardId: "mockBoardId",
        taskId: "mockTaskId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Get all task from board", () => {
    it("should return all tasks for a given board", async () => {
      const mockTasks = [
        {
          _id: "task1",
          title: "Task 1",
          boardId: "mockBoardId",
          status: "To Do",
          priority: "High",
        },
        {
          _id: "task2",
          title: "Task 2",
          boardId: "mockBoardId",
          status: "In Progress",
          priority: "Medium",
        },
      ];

      Task.find.mockResolvedValue(mockTasks);
      await getAllTaskFromBoard(req, res);
      expect(Task.find).toHaveBeenCalledWith({ boardId: "mockBoardId" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should return 500 if there is an error retrieving tasks", async () => {
      Task.find.mockRejectedValue(new Error("Failed to retrive tasks."));
      await getAllTaskFromBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to retrive tasks.",
        }),
      );
    });
  });

  describe("Create task", () => {
    it("should create a new task for a given board", async () => {
      const mockTask = {
        _id: "task1",
        title: "Task 1",
        boardId: "mockBoardId",
        status: "To Do",
        priority: "High",
      };

      Task.create.mockResolvedValue(mockTask);
      req.body = {
        title: "Task 2",
        status: "To Do",
        priority: "High",
      };
      await createTask(req, res);
      expect(Task.create).toHaveBeenCalledWith({
        ...req.body,
        boardId: "mockBoardId",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 500 if there is an error creating a task", async () => {
      Task.create.mockRejectedValue(new Error("Failed to create task."));
      req.body = {
        title: "Task 2",
        status: "To Do",
        priority: "High",
      };

      await createTask(req, res);
      expect(Task.create).toHaveBeenCalledWith({
        ...req.body,
        boardId: "mockBoardId",
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to create task.",
        }),
      );
    });
  });

  describe("Get task by ID", () => {
    it("should return a task by its ID", async () => {
      const mockTask = {
        _id: "task1",
        title: "Task 1",
        boardId: "mockBoardId",
        status: "To Do",
        priority: "High",
      };

      Task.findOne.mockResolvedValue(mockTask);
      await getTaskById(req, res);
      expect(Task.findOne).toHaveBeenCalledWith({ _id: "mockTaskId" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 404 if task is not found", async () => {
      Task.findOne.mockResolvedValue(null);
      await getTaskById(req, res);
      expect(Task.findOne).toHaveBeenCalledWith({ _id: "mockTaskId" });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found." });
    });

    it("should return 500 if there is an error retrieving the task", async () => {
      Task.findOne.mockRejectedValue(new Error("Failed to retrieve task."));
      await getTaskById(req, res);
      expect(Task.findOne).toHaveBeenCalledWith({ _id: "mockTaskId" });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to retrieve task.",
        }),
      );
    });
  });

  describe("Update task", () => {
    it("should update a task by its ID", async () => {
      const mockUpdatedTask = {
        _id: "task1",
        title: "Updated Task 1",
        boardId: "mockBoardId",
        status: "In Progress",
        priority: "Medium",
      };

      Task.findByIdAndUpdate.mockResolvedValue(mockUpdatedTask);
      req.body = {
        title: "Updated Task 2",
        status: "In Progress",
        priority: "Medium",
        boardId: "mockBoardId",
      };
      await updateTask(req, res);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: "mockTaskId" },
        req.body,
        { new: true },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedTask);
    });

    it("should return 404 when task to update is not found", async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);
      await updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found." });
    });

    it("should return 500 when there is an error updating the task", async () => {
      Task.findByIdAndUpdate.mockRejectedValue(
        new Error("Failed to update task."),
      );
      await updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Failed to update task." }),
      );
    });
  });

  describe("Delete task", () => {
    it("should return 200 when task is successfully deleted", async () => {
      const mockDeletedTask = {
        _id: "task1",
        title: "Task 1",
        boardId: "mockBoardId",
        status: "To Do",
        priority: "High",
      };
      Task.findOneAndDelete.mockResolvedValue(mockDeletedTask);
      await deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedTask);
    });

    it("should return 404 when task to delete is not found", async () => {
      Task.findOneAndDelete.mockResolvedValue(null);
      await deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found." });
    });

    it("should return 500 when there is an error delete the task", async () => {
      Task.findOneAndDelete.mockRejectedValue(
        new Error("Failed to delete task."),
      );
      await deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Failed to delete task." }),
      );
    });
  });
});
