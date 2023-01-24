const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("Authorization");

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  // verify jwt token
  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      } else {
        //send user_id in req
        req.user_id = decoded.user_id;
        next();
      }
    });
  } catch (err) {
    console.error("Something went wrong");
    res.status(500).json({ message: "Server Error" });
  }
};
