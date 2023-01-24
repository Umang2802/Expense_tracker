const Account = require("../models/account");
const User = require("../models/user");

const getAllAccountsByUser = async (req, res) => {
  try {
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }
    const accounts = await Account.find({ user: req.user_id }).select("-user");
    res.status(200).json(accounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const addAccount = async (req, res) => {
  try {
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const { name } = req.body;

    const checkAccount = await Account.findOne({
      name: name,
      user: req.user_id,
    });
    if (checkAccount) {
      res.status(400).json({ message: "Account already exists" });
      return;
    }
    req.body.user = req.user_id;
    const account = new Account(req.body);
    const result = await account.save();
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateAccount = async (req, res) => {
  try {
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const checkAccount = await Account.findById(req.params.id);
    if (!checkAccount) {
      res.status(400).json({ message: "Account not found" });
      return;
    }

    const result = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-user -createdAt -updatedAt -__v");
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const account_id = req.params.id;
    const checkAccount = await Account.findById(account_id);
    if (!checkAccount) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    await Account.findByIdAndDelete(account_id);
    res.status(200).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllAccountsByUser,
  addAccount,
  updateAccount,
  deleteAccount,
};
