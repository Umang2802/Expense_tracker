const Account = require("../models/account");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const checkUser = require("../utils/checkUser");

const getAllAccountsByUser = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id }).select("-user");
    res.status(200).json(accounts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const addAccount = async (req, res) => {
  try {
    const { name, amount } = req.body;
    const user_id = req.user._id;

    const checkAccount = await Account.findOne({
      name: name,
      user: user_id,
    });
    if (checkAccount) {
      res.status(400).json({ message: "Account already exists" });
      return;
    }

    req.body.user = user_id;
    const account = new Account(req.body);
    await account.save();

    const user = await User.findById(user_id);
    user.inflow += amount;
    await User.findByIdAndUpdate(user_id, user);
    const newAccount = await Account.findById(account._id).select("-user -_id");

    res.status(200).json(newAccount);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { amount } = req.body;
    const checkAccount = await Account.findById(req.params.id);
    if (!checkAccount) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    const result = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-user -_id");

    let newInflow = req.user.inflow;
    newInflow -= checkAccount.amount;
    newInflow += Number(amount);
    await User.findByIdAndUpdate(req.user._id, { inflow: newInflow });
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const account_id = req.params.id;
    const checkAccount = await Account.findById(account_id);
    if (!checkAccount) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    const transactions = await Transaction.find({ account: account_id });
    let inflow = 0,
      outflow = 0;
    transactions.forEach((transaction) => {
      if (transaction.cashFlow === "Income") {
        inflow += transaction.amount;
      } else if (transaction.cashFlow === "Expense") {
        outflow += transaction.amount;
      }
    });
    await User.findByIdAndUpdate(req.user._id, { inflow, outflow });
    await Transaction.deleteMany({ account: account_id });
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
