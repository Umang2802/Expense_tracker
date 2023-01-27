const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      user_id: user.id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    );
  });
};
