const { default: mongoose } = require("mongoose");
const Account = require("../models/account");
const Transaction = require("../models/transaction");
const User = require("../models/user");

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
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const { account, cashFlow, amount } = req.body;
      const user = req.user;
      amount = Number(amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }

      const checkAccount = await Account.findOne(
        {
          _id: account,
          user: user._id,
        },
        null,
        { session }
      );
      if (!checkAccount) {
        res.status(404).json({ message: "Account not found" });
        return;
      }

      req.body.account = checkAccount._id;
      req.body.user = user._id;
      const transaction = new Transaction(req.body);
      await transaction.save({ session });

      if (cashFlow === "Income") {
        user.inflow += amount;
        checkAccount.amount += amount;
      } else if (cashFlow === "Expense") {
        user.outflow += amount;
        if (checkAccount.amount - amount < 0) {
          res.status(400).json({ message: "Not enough balance in account" });
          return;
        }
        checkAccount.amount -= amount;
      }
      await Account.findByIdAndUpdate(checkAccount._id, checkAccount, null, {
        session,
      });
      await User.findByIdAndUpdate(user._id, user, null, { session });

      const newTransaction = await Transaction.findById(transaction._id, null, {
        session,
      }).select("-user -createdAt -updatedAt");

      res.status(200).json(newTransaction);
    });
    session.endSession();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const user = req.user;
      const transaction_id = req.params.id;
      const { account, amount } = req.body;
      amount = Number(amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }
      const checkTransaction = await Transaction.findById(
        transaction_id,
        null,
        {
          session,
        }
      );
      if (!checkTransaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      const checkOldAccount = await Account.findOne(
        {
          _id: checkTransaction.account,
          user: user._id,
        },
        null,
        { session }
      );
      if (!checkOldAccount) {
        res.status(404).json({ message: "Old Account not found" });
        return;
      }

      const checkAccount = await Account.findOne(
        {
          _id: account,
          user: user._id,
        },
        null,
        { session }
      );
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
        { new: true },
        null,
        { session }
      ).select("-user -createdAt -updatedAt");

      if (result.cashFlow === "Income") {
        user.inflow += amount;
        checkAccount.amount += amount;
      } else if (result.cashFlow === "Expense") {
        user.outflow += amount;
        if (checkAccount.amount - amount < 0) {
          res.status(400).json({ message: "Not enough balance in account" });
          return;
        }
        checkAccount.amount -= amount;
      }
      await Account.findByIdAndUpdate(
        checkOldAccount._id,
        checkOldAccount,
        null,
        { session }
      );
      await Account.findByIdAndUpdate(checkAccount._id, checkAccount, null, {
        session,
      });
      await User.findByIdAndUpdate(user._id, user, null, { session });

      res.status(200).json(result);
    });
    session.endSession();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const user = req.user;
      const transaction_id = req.params.id;
      const checkTransaction = await Transaction.findById(
        transaction_id,
        null,
        { session }
      );
      if (!checkTransaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      const checkAccount = await Account.findById(
        checkTransaction.account,
        null,
        { session }
      );
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

      await User.findByIdAndUpdate(user._id, user, null, { session });
      await Account.findByIdAndUpdate(checkAccount._id, checkAccount, null, {
        session,
      });
      await Transaction.findByIdAndDelete(transaction_id, null, { session });
      res.status(200).send();
    });
    session.endSession();
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
