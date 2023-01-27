const Account = require("../models/account");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const checkUser = require("../utils/checkUser");

const getAllTransactionsByUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
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
    const { account, cashFlow, amount } = req.body;
    const user = req.user;

    const checkAccount = await Account.findOne({
      _id: account,
      user: user._id,
    });
    if (!checkAccount) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    req.body.account = checkAccount._id;
    req.body.user = user._id;
    const transaction = new Transaction(req.body);
    await transaction.save();

    if (cashFlow === "Income") {
      user.inflow += amount;
      checkAccount.amount += amount;
    } else if (cashFlow === "Expense") {
      user.outflow += amount;
      checkAccount.amount -= amount;
    }
    await Account.findByIdAndUpdate(checkAccount._id, checkAccount);
    await User.findByIdAndUpdate(user._id, user);

    const newTransaction = await Transaction.findById(transaction._id).select(
      "-user -createdAt -updatedAt"
    );

    res.status(200).json(newTransaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const user = req.user;
    const transaction_id = req.params.id;
    const { account, amount } = req.body;
    const checkTransaction = await Transaction.findById(transaction_id);
    if (!checkTransaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    const checkOldAccount = await Account.findOne({
      _id: checkTransaction.account,
      user: user._id,
    });
    if (!checkOldAccount) {
      res.status(404).json({ message: "Old Account not found" });
      return;
    }

    const checkAccount = await Account.findOne({
      _id: account,
      user: user._id,
    });
    if (!checkAccount) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    if (checkTransaction.cashFlow === "Income") {
      user.inflow -= checkTransaction.amount;
      checkOldAccount.amount -= checkTransaction.amount;
    } else if (checkTransaction.cashFlow === "Expense") {
      user.outflow -= checkTransaction.amount;
      checkOldAccount.amount += checkTransaction.amount;
    }

    req.body.account = checkAccount._id;
    const result = await Transaction.findByIdAndUpdate(
      transaction_id,
      req.body,
      { new: true }
    ).select("-user -createdAt -updatedAt");

    if (result.cashFlow === "Income") {
      user.inflow += amount;
      checkAccount.amount += amount;
    } else if (result.cashFlow === "Expense") {
      user.outflow += amount;
      checkAccount.amount -= amount;
    }

    await Account.findByIdAndUpdate(checkOldAccount._id, checkOldAccount);
    await Account.findByIdAndUpdate(checkAccount._id, checkAccount);
    await User.findByIdAndUpdate(user._id, user);

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const user = req.user;
    const transaction_id = req.params.id;
    const checkTransaction = await Transaction.findById(transaction_id);
    if (!checkTransaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    const checkAccount = await Account.findById(checkTransaction.account);
    if (!checkAccount) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    if (checkTransaction.cashFlow === "Income") {
      user.inflow -= checkTransaction.amount;
      checkAccount.amount -= checkTransaction.amount;
    } else if (checkTransaction.cashFlow === "Expense") {
      user.outflow -= checkTransaction.amount;
      checkAccount.amount += checkTransaction.amount;
    }

    await User.findByIdAndUpdate(user._id, user);
    await Account.findByIdAndUpdate(checkAccount._id, checkAccount);
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
