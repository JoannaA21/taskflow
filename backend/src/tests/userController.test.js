const {
  getAllUser,
  getUserById,
  createUser,
  deleteUser,
} = require("../controllers/userController");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

jest.mock("../models/userModel");
jest.mock("bcryptjs");

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { id: "someUserId" },
      body: {
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Get all users", () => {
    it("should return 404 if no user exists", async () => {
      User.find.mockResolvedValue([]); //mock the find function to return an empty array, simulating no users in database
      await getAllUser(req, res); //call the getAllUsers function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(404); //expect the status function to have been called with 404
      expect(res.json).toHaveBeenCalledWith({ message: "No existing users." }); //expect the json function to have been called with the error message
    });

    it("shoukd return 200 and all users if users exists", async () => {
      const mockUsers = [
        { _id: "1", username: "user1", email: "user1@example.com" },
        { _id: "2", username: "user2", email: "user2@example.com" },
      ];

      User.find.mockResolvedValue(mockUsers); //mock the find function to return an array of users, simulating users in database
      await getAllUser(req, res); //call the getAllUsers function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(200); //expect the status function to have been called with 200
      expect(res.json).toHaveBeenCalledWith(mockUsers); //expect the json function to have been called with the array of users
    });

    it("should return 500 if there is an error", async () => {
      User.find.mockRejectedValue(new Error("Database error")); //mock the find function to reject with an error, simulating a database error
      await getAllUser(req, res); //call the getAllUsers function with the mocked req and res
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" }); //expect the json function to have been called with the error message
    });
  });

  describe("Get user by Id", () => {
    it("should return 404 if user Id is invalid", async () => {
      req.params.id = "invalidId";

      await getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
    });

    it("should return 404 if user does not exist", async () => {
      User.findById.mockResolvedValue(null); //mock the findById function to return null, simulating user not found in database
      await getUserById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
    });

    it("should return 200 and the user if user exists", async () => {
      //   const mockUserId = { id: "validUserId" };
      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        email: "testUser@email.com",
        password: "password",
      };
      req.params = { id: "507f1f77bcf86cd799439011" }; //set the req.params.id to a valid ObjectId string
      User.findById.mockResolvedValue(mockUser); //mock the findById function to return a user, simulating user found in database
      await getUserById(req, res);
      expect(User.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011"); //expect the findById function to have been called with the user Id from req.params
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 500 if there is an error", async () => {
      req.params = { id: "507f1f77bcf86cd799439011" }; //set the req.params.id to a valid ObjectId string
      User.findById.mockRejectedValue(
        new Error("Failed to retrieve user by Id."),
      );
      await getUserById(req, res);
      expect(User.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to retrieve user by Id.",
        }),
      );
    });
  });

  describe("Create user", () => {
    it("shouldreturn 200 and the new user if user is created successfully", async () => {
      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
      };
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.create.mockResolvedValue(mockUser);
      await createUser(req, res);
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("testpassword", "salt");
      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        email: "testuser@example.com",
        password: "hashedPassword",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 500 if there is error creating a user", async () => {
      User.create.mockRejectedValue(new Error("Failed to create user."));
      await createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to create user.",
        }),
      );
    });
  });

  describe("Delete user", () => {
    it("should return 404 if user Id is invalid", async () => {
      req.params = "invalidId";
      await deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
    });

    it("should turn 404 if user is not found", async () => {
      User.findOneAndDelete.mockResolvedValue(null);
      await deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
    });

    it("should return 200 and the deleted user if user is deleted successfully", async () => {
      const mockDeletedUser = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        email: "testuser@example.com",
        password: "hashedPassword",
      };

      req.params = { id: "507f1f77bcf86cd799439011" };
      User.findOneAndDelete.mockResolvedValue(mockDeletedUser);
      await deleteUser(req, res);
      expect(User.findOneAndDelete).toHaveBeenCalledWith({
        _id: "507f1f77bcf86cd799439011",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedUser);
    });

    it("should return 500 if there is an error deleting a user", async () => {
      req.params = { id: "507f1f77bcf86cd799439011" }; //set the req.params.id to a valid ObjectId string
      User.findOneAndDelete.mockRejectedValue(
        new Error("Failed to delete user."),
      );

      await deleteUser(req, res);
      expect(User.findOneAndDelete).toHaveBeenCalledWith({
        _id: "507f1f77bcf86cd799439011",
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to delete user.",
        }),
      );
    });
  });
});
