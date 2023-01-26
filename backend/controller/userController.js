const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkUser = require("../utils/checkUser");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Incorrect email" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }

    const token = await createJwtToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    delete req.body.inflow;
    delete req.body.outflow;
    user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = await createJwtToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    //to delete email from req.body
    delete req.body.email;
    delete req.body.inflow;
    delete req.body.outflow;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password -__v -_id");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const info = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const createJwtToken = (user) => {
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

module.exports = { login, register, info, updateUser };
