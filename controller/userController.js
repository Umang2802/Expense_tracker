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
    res.status(200).json({ token, message: "Logged in successfully" });
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
    if (req.body.image) {
      await cloudinary.uploader.upload(
        req.body.image,
        { folder: "Expense_tracker_users" },
        // { upload_preset: "Expense_tracker_users" }
        (error, result) => {
          if (error) throw new Error();
          req.body.profileImage = {
            imageUrl: result.secure_url,
            imageId: result.public_id,
          };
        }
      );
    }

    delete req.body.inflow;
    delete req.body.outflow;
    user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = await createJwtToken(user);
    res.status(200).json({ token, message: "Signup successfully" });
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
    const user = req.user;

    if (req.body.image) {
      if (
        req.body.image.imageId &&
        user.profileImage.imageId !== req.body.image.imageId
      ) {
        await cloudinary.uploader.destroy(user.profileImage.imageId);
      } else if (!req.body.image.imageId)
        await cloudinary.uploader.upload(
          req.body.image,
          { folder: "Expense_tracker_users" },
          // { upload_preset: "Expense_tracker_users" }
          (error, result) => {
            if (error) throw new Error();
            req.body.profileImage = {
              imageUrl: result.secure_url,
              imageId: result.public_id,
            };
          }
        );
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password -_id");
    res
      .status(200)
      .json({ updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const info = async (req, res) => {
  try {
    res.status(200).json({ user: req.user, message: "Success" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { login, register, info, updateUser };
