const Account = require("../models/account");
const Transaction = require("../models/transaction");
const User = require("../models/user");

const getAllTransactionsByUser = async (req, res) => {
  try {
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }
    const transactions = await Transaction.find({
      user: req.user_id,
    })
      .populate("account", "name")
      .select("-user");
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { account } = req.body;
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }
    const checkAccount = await Account.findOne({
      name: account,
      user: req.user_id,
    });
    if (!checkAccount) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    req.body.account = checkAccount._id;
    req.body.user = req.user_id;
    const transaction = new Transaction(req.body);
    const result = await transaction.save();
    // .select("-user -createdAt -updatedAt -__v");
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const transaction_id = req.params.id;
    const { account } = req.body;
    const checkTransaction = await Transaction.findById(transaction_id);
    if (!checkTransaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }
    const checkAccount = await Account.find({
      name: account,
      user: req.user_id,
    });
    if (!checkAccount) {
      res.status(404).json({ message: "Account not found" });
      return;
    }
    req.body.account = checkAccount._id;

    const result = await Transaction.findByIdAndUpdate(
      transaction_id,
      req.body,
      { new: true }
    ).select("-user -createdAt -updatedAt -__v");
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }

    const transaction_id = req.params.id;
    const checkTransaction = await Transaction.findById(transaction_id);
    if (!checkTransaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }
    await Transaction.findByIdAndDelete(transaction_id);
    res.status(200).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllTransactionsByUser,
  addTransaction,
  updateTransaction,
  deleteTransaction,
};
