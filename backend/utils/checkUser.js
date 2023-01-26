const User = require("../models/user");

module.exports = async (user_id) => {
  const user = await User.findById(user_id);
  if (!user) {
    return false;
  }
  return true;
};
