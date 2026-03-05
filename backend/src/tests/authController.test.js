const { login, logout } = require("../controllers/authController");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//replace real Mongo calls
jest.mock("../models/userModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("login", () => {
  let req, res;

  // run this code before every ('it')test
  // instead of writing the same code in every test, we can write it once here and it will run before each test
  beforeEach(() => {
    req = {
      body: {
        emailOrUsername: "testuser",
        password: "testpassword",
      },
    };

    res = {
      //fake function that does nothing. Need to mock the status and json function to match login controller expected response
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if user does not exist", async () => {
    User.findOne.mockResolvedValue(null); //mock the findOne function to return null, simulating user not found. Fake database

    await login(req, res); //call the login function with the mocked req and res

    expect(res.status).toHaveBeenCalledWith(401); //expect the status function to have been called with 401
    expect(res.json).toHaveBeenCalledWith({
      message: "Username or email does not exist.",
    }); //expect the json function to have been called with the error message
  });

  it("should return 401 if password is incorrect", async () => {
    User.findOne.mockResolvedValue({
      password: "hashedpassword",
    });
    bcrypt.compare.mockResolvedValue(false); //mock the compare function to return false, simulating incorrect password. Fake password comparison

    await login(req, res); //call the login function with the mocked req and res
    expect(res.status).toHaveBeenCalledWith(401); //expect the status function to have been called with 401
  });

  it("should return user details and toekn if login is successful", async () => {
    User.findOne.mockResolvedValue({
      _id: "123",
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
    });

    bcrypt.compare.mockResolvedValue(true); //mock the compare function to return true, simulating correct password
    jwt.sign.mockReturnValue("mocktoken"); //mock the sign function to return a mock token. Fake token generation

    await login(req, res); //call the login function with the mocked req and res
    expect(res.json).toHaveBeenCalledWith({
      details: {
        details: {
          _id: "123",
          username: "testuser",
          email: "test@example.com",
        },
        token: "mocktoken",
      },
    });
  });

  it("should return 500 if there is an error", async () => {
    User.findOne.mockRejectedValue(
      new Error("An error occurred while logging in."),
    ); //mock the findOne function to throw an error, simulating a database error
    await login(req, res); //call the login function with the mocked req and res
    expect(res.status).toHaveBeenCalledWith(500); //expect the status function to have been called with 500
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "An error occurred while logging in.",
      }),
    ); //expect the json function to have been called with an object containing the error message
  });
});

describe("logout", () => {
  let res;

  beforeEach(() => {
    res = {
      clearCookie: jest.fn().mockReturnThis(), //mock the clearCookie function to return this, allowing for chaining with status and json
      status: jest.fn().mockReturnThis(), //mock the status function to return this, allowing for chaining with clearCookie and json
      json: jest.fn(), //mock the json function to do nothing, as we will check its calls separately
    };
  });

  it("should clear the token cookie, return status and success message", () => {
    logout({}, res); //call the logout function with the mocked req and res
    expect(res.clearCookie).toHaveBeenCalledWith("token"); //expect the clearCookie function to have been
    expect(res.status).toHaveBeenCalledWith(200); //expect the status function to have been called with 200
    expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" }); //expect the json function to have been called with the success message
  });

  it("should return 500 if there is an error", () => {
    res.clearCookie.mockImplementation(() => {
      throw new Error("Cookie failure");
    }); //mock the clearCookie function to throw an error, simulating an error during logout

    logout({}, res); //call the logout function with the mocked req and res

    expect(res.status).toHaveBeenCalledWith(500); //expect the status function to have been called with 500
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred during logout",
    }); //expect the json function to have been called with the error message
  });
});
