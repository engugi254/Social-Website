

const session = require('express-session');

// Middleware function to authorize paths using sessions
const authorize = (req, res, next) => {
  // Check if user is authenticated
  if (req.session.userId && req.session.authorized) {
    // User is authenticated, proceed to the next middleware
    next();
  } else {
    // User is not authenticated, redirect to login page or send an error response
    res.send("Logging to proceed"); // Example redirect to login page
  }
};

// Export the middleware function
module.exports = authorize;
