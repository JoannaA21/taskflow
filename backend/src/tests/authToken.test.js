const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/authToken");

jest.mock("jsonwebtoken");

describe("Authenticate Token Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer mockToken",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no token is provided", () => {
    req.headers.authorization = undefined; // Simulate missing token
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing token. Please login",
    });
  });

  it("should call next() and attach user to req if token is valid", () => {
    const mockUser = { _id: "user123", name: "Test User" }; // Mock user data to be returned by jwt.verify

    // Mock the jwt.verify function to simulate successful token verification
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    authenticateToken(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if token verification fails", () => {
    const mockError = new Error("An error occurred while verifying token.");

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(mockError, null);
    });
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "An error occurred while verifying token.",
      }),
    );
  });
});
