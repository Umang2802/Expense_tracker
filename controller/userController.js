const User = require("../models/user");
const bcrypt = require("bcrypt");
const createJwtToken = require("../utils/createJwtToken");
const { cloudinary } = require("../config/cloudinary");
const { default: mongoose } = require("mongoose");
const Account = require("../models/account");

const check_user_email = async (req, res) => {
  try {
    const { email } = req.body;
    user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    res.status(200).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res, next) => {
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
    req.token = token;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const register = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const { email, password } = req.body.user;

      user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
      if (req.body.user.image) {
        await cloudinary.uploader.upload(
          req.body.user.image,
          { folder: "Expense_tracker_users" },
          (error, result) => {
            if (error) throw new Error();
            req.body.user.profileImage = {
              imageUrl: result.secure_url,
              imageId: result.public_id,
            };
          }
        );
      }

      delete req.body.user.inflow;
      delete req.body.user.outflow;
      user = new User(req.body.user);

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save({ session });

      //create account
      amount = Number(req.body.account.amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }

      req.body.account.user = user._id;
      const account = new Account(req.body.account);
      await account.save({ session });

      user.inflow += amount;
      const updatedUser = await User.findByIdAndUpdate(user._id, user, {
        new: true,
      })
        .select("-password -_id")
        .session(session);
      const newAccount = await Account.findById(account._id)
        .session(session)
        .select("-user -_id");

      const token = await createJwtToken(user);

      res.status(200).json({
        user: updatedUser,
        account: newAccount,
        token,
        message: "Signup successfully",
      });
    });
    session.endSession();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUser = async (req, res, next) => {
  try {
    //to delete email,inflow,outflow from req.body
    delete req.body.email;
    delete req.body.inflow;
    delete req.body.outflow;
    const user = await User.findById(req.userId);

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
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }
    await User.findByIdAndUpdate(user._id, req.body);
    req.message = "Profile updated successfully";
    req.userId = user._id;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const info = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -_id");
    res.status(200).json({ user, message: "Success" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { login, register, info, updateUser, check_user_email };
