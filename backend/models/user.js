const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  inflow: { type: Number, default: 0 },
  outflow: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
