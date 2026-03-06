const {
  getAllBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");
const Board = require("../models/boardModel");

jest.mock("../models/boardModel");

describe("Board Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test

    req = {
      user: { _id: "user123" }, // fake user id
      params: { id: "board123" }, // fake board id for getBoardById
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Reset mocks before each test
    Board.find.mockReset();
  });

  describe("getAllBoards", () => {
    // Get all boards for the logged-in user
    it("should return 404 if no boards are found", async () => {
      Board.find.mockResolvedValue([]); //mock the find function to return an empty array, simulating no boards found. Fake database
      await getAllBoards(req, res); //call the getAllBoards function with the mocked req and res

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No boards found." });
    });

    it("should return 200 and the boards if boards are found", async () => {
      const mockBoards = [
        {
          _id: "1",
          name: "Board 1",
          userId: "user123",
          tasks: [],
          description: "Test board 1",
        },
        {
          _id: "2",
          name: "Board 2",
          userId: "user123",
          tasks: [],
          description: "Test board 2",
        },
      ];
      Board.find.mockResolvedValue(mockBoards);
      await getAllBoards(req, res); //call the getAllBoards function with the mocked req and res
      expect(Board.find).toHaveBeenCalledWith({ userId: "user123" }); //expect the find function to have been called with the userId of the logged-in user
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBoards); //expect the json function to have been called with an array of boards
    });

    it("should return 500 if there is an error", async () => {
      Board.find.mockRejectedValue(new Error("Failed to retrieve boards.")); //mock the find function to throw an error, simulating a database error. Fake database error
      await getAllBoards(req, res); //call the getAllBoards function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(500); //expect the status function to have been called with 500
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to retrieve boards.",
        }),
      );
    });
  });

  describe("createBoard", () => {
    //Create a new project/board
    it("should return 201 and the new board if board is created successfully", async () => {
      const mockBoard = {
        _id: "1",
        name: "New Board",
        userId: "123",
        tasks: [],
        description: "Test new board",
      };
      Board.create.mockResolvedValue(mockBoard); //mock the create function to return a new board, simulating successful board creation. Fake database
      req.body = {
        name: "New Board",
        description: "Test new board",
        tasks: [],
      };

      await createBoard(req, res); //call the createBoard function with the mocked req and res
      expect(Board.create).toHaveBeenCalledWith({
        name: "New Board",
        description: "Test new board",
        tasks: [],
        userId: "user123",
      }); //expect the create function to have been called with the board data and the userId of the logged-in user
      expect(res.status).toHaveBeenCalledWith(201); //expect the status function to have been called with 201
      expect(res.json).toHaveBeenCalledWith(mockBoard); //expect the json function to have been called with the new board
    });

    it("should return 500 if there is an error in creating a new board", async () => {
      Board.create.mockRejectedValue(
        new Error("Failed to create a new board."),
      ); //mock the create function to throw an error, simulating a database error. Fake database error
      await createBoard(req, res); //call the createBoard function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to create a new board.",
        }),
      );
    });
  });

  describe("getBoardById", () => {
    //Get a specific project/board by ID
    it("should return 404 if board is not found", async () => {
      Board.findOne.mockResolvedValue(null); //mock the findOne function to return null, simulating board not found. Fake database
      await getBoardById(req, res); //call the getBoardById function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(404); //expect the status function to have been called with 404
      expect(res.json).toHaveBeenCalledWith({ message: "Board not found." }); //expect the json function to have been called with the error message
    });

    it("should return 200 and the board if board is found", async () => {
      const mockBoard = {
        _id: "1",
        name: "Test Board",
        userId: "123",
        tasks: [],
        description: "Test board description",
      };
      Board.findOne.mockResolvedValue(mockBoard);

      await getBoardById(req, res); //call the getBoardById function with the mocked req and res
      expect(Board.findOne).toHaveBeenCalledWith({
        _id: "board123",
        userId: "user123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBoard);
    });

    it("should return 500 if there is an error in retrieving the board", async () => {
      Board.findOne.mockRejectedValue(new Error("Failed to retrieve board.")); //mock the findOne function to throw an error, simulating a database error. Fake database error
      await getBoardById(req, res); //call the getBoardById function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to retrieve board.",
        }),
      );
    });
  });

  describe("updateBoard", () => {
    //Update a project/board
    it("should return 404 if board to update is not found", async () => {
      Board.findOneAndUpdate.mockResolvedValue(null);
      await updateBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Board not found." });
    });

    it("should return 200 and the updated board if board is updated successfully", async () => {
      const mockUpdatedBoard = {
        _id: "1",
        name: "Updated Board",
        userId: "123",
        tasks: [],
        description: "Updated board description",
      };

      Board.findOneAndUpdate.mockResolvedValue(mockUpdatedBoard); //mock the findOneAndUpdate function to return the updated board, simulating successful board update. Fake database

      req.body = {
        name: "Update Board",
        description: "Updated board",
        tasks: [],
      };

      await updateBoard(req, res);
      expect(Board.findOneAndUpdate).toHaveBeenCalledWith(
        {
          userId: "user123",
          _id: "board123",
        },
        req.body,
        { new: true },
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedBoard);
    });

    it("should return 500 if there is an error in updating the board", async () => {
      Board.findOneAndUpdate.mockRejectedValue(
        new Error("Failed to update board."),
      ); //mock the findOneAndUpdate function to throw an error, simulating a database error. Fake database error
      await updateBoard(req, res); //call the updateBoard function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to update board.",
        }),
      );
    });
  });

  describe("deleteBoard", () => {
    //Delete a project/board
    it("should return 404 if board to delete is not found", async () => {
      Board.findOneAndDelete.mockResolvedValue(null);
      await deleteBoard(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Board not found." });
    });

    it("should return 200 and success message if board is deleted successfully", async () => {
      Board.findOneAndDelete.mockResolvedValue({ _id: "board123" }); //mock the findOneAndDelete function to return the deleted board, simulating successful board deletion. Fake database
      await deleteBoard(req, res);
      expect(Board.findOneAndDelete).toHaveBeenCalledWith({
        userId: "user123",
        _id: "board123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Board deleted successfully.",
      });
    });

    it("should return 500 if there is an error in deleting the board", async () => {
      Board.findOneAndDelete.mockRejectedValue(
        new Error("Failed to delete board."),
      ); //mock the findOneAndDelete function to throw an error, simulating a database error. Fake database error
      await deleteBoard(req, res); //call the deleteBoard function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to delete board.",
        }),
      );
    });
  });
});
