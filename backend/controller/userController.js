const User = require("../models/user");
const bcrypt = require("bcrypt");
const createJwtToken = require("../utils/createJwtToken");
const { cloudinary } = require("../config/cloudinary");

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
  try {
    const { email, password } = req.body;

    user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    if (req.body.profileImage) {
      //cloudinary
      cloudinary.uploader
        .upload(
          req.body.profileImage
          // { upload_preset: "Expense_tracker_users" }
          // (error, result) => {
          //   console.log("error" + error);
          //   req.body.profileImage = result;
          // }
        )
        .then((res) => console.log("success"))
        .catch((err) => console.log(err));
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
    //to delete email,inflow,outflow from req.body
    delete req.body.email;
    delete req.body.inflow;
    delete req.body.outflow;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password -_id");
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

module.exports = { login, register, info, updateUser };
