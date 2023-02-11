const jwt = require("jsonwebtoken");
const User = require("./models/user");

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization");

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  // verify jwt token
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      } else {
        //send user in req
        const user = await User.findById(payload.user_id).select("-password");
        if (!user) {
          return res.status(401).json({ message: "Authorization denied" });
        }
        req.userId = user._id;
        next();
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
