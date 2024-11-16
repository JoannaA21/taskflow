const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware function to authenticate a token from request headers
const authenticateToken = (req, res, next) => {
  // Extract the Authorization header, which usually contains the token in 'Bearer token' format
  const authHeader = req.headers["authorization"];
  // If the header exists, split it by space and take the second part as the token; otherwise, token is undefined
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token. Please login" });
  }

  // Verify the token using the secret key stored in environment variables
  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
    // If there's an error verifying the token, respond with a 403 status and error details
    if (error) {
      return res.status(403).json({
        error: error.message || "An error occurred while verifying token.",
        details: error,
      });
    }

    // If verification is successful, attach the decoded user data to the request object for later use
    console.log("Decoded user data:", user); // Log the user data
    req.user = user;

    // Call the next middleware or route handler
    next();
  });
};

module.exports = {
  authenticateToken,
};

// The purpose of this function is to retrieve the token from the request header,
// verify its validity, and if valid, attach the user's details to the request object
// for further use in protected routes.
