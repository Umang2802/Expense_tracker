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
      const { account, cashFlow } = req.body;
      let { amount } = req.body;
      let user = req.user;
      amount = Number(amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }

      let checkAccount = await Account.findOne({
        _id: account,
        user: user._id,
      }).session(session);
      if (!checkAccount) {
        res.status(404).json({ message: "Account not found" });
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
        const diff = checkAccount.amount - amount;
        if (diff < 0) {
          res.status(400).json({ message: "Not enough balance in account" });
          await session.abortTransaction();
          return;
        }
        checkAccount.amount -= amount;
      }

      await Account.findByIdAndUpdate(checkAccount._id, checkAccount).session(
        session
      );
      await User.findByIdAndUpdate(user._id, user).session(session);

      const newTransaction = await Transaction.findById(transaction._id)
        .session(session)
        .select("-user -createdAt -updatedAt");

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
      let user = req.user;
      const transaction_id = req.params.id;
      const { account } = req.body;
      let { amount } = req.body;
      amount = Number(amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }
      const checkTransaction = await Transaction.findById(
        transaction_id
      ).session(session);
      if (!checkTransaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      let checkAccount = await Account.findOne({
        _id: account,
        user: user._id,
      }).session(session);
      if (!checkAccount) {
        res.status(404).json({ message: "Account not found" });
        return;
      }

      req.body.account = account._id;
      const result = await Transaction.findByIdAndUpdate(
        transaction_id,
        req.body,
        { new: true }
      )
        .session(session)
        .select("-user -createdAt -updatedAt");

      if (checkTransaction.cashFlow === "Income") {
        user.inflow -= checkTransaction.amount;
      } else if (checkTransaction.cashFlow === "Expense") {
        user.outflow -= checkTransaction.amount;
      }

      //if Old account is not same as new account
      if (account !== checkTransaction.account) {
        let checkOldAccount = await Account.findOne({
          _id: checkTransaction.account,
          user: user._id,
        }).session(session);
        if (!checkOldAccount) {
          res.status(404).json({ message: "Old Account not found" });
          return;
        }
        if (checkTransaction.cashFlow === "Income") {
          checkOldAccount.amount -= checkTransaction.amount;
        } else if (checkTransaction.cashFlow === "Expense") {
          checkOldAccount.amount += checkTransaction.amount;
        }
        await Account.findByIdAndUpdate(
          checkOldAccount._id,
          checkOldAccount
        ).session(session);
      }

      if (checkTransaction.cashFlow === "Income") {
        checkAccount.amount -= checkTransaction.amount;
      } else if (checkTransaction.cashFlow === "Expense") {
        checkAccount.amount += checkTransaction.amount;
      }

      if (result.cashFlow === "Income") {
        user.inflow += amount;
        checkAccount.amount += amount;
      } else if (result.cashFlow === "Expense") {
        user.outflow += amount;
        const diff = checkAccount.amount - amount;
        if (diff < 0) {
          res.status(400).json({ message: "Not enough balance in account" });
          await session.abortTransaction();
          return;
        }
        checkAccount.amount -= amount;
      }

      await Account.findByIdAndUpdate(checkAccount._id, checkAccount).session(
        session
      );

      await User.findByIdAndUpdate(user._id, user).session(session);

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
      let user = req.user;
      const transaction_id = req.params.id;
      const checkTransaction = await Transaction.findById(
        transaction_id
      ).session(session);
      if (!checkTransaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      let checkAccount = await Account.findById(
        checkTransaction.account
      ).session(session);
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

      await User.findByIdAndUpdate(user._id, user).session(session);
      await Account.findByIdAndUpdate(checkAccount._id, checkAccount).session(
        session
      );
      await Transaction.findByIdAndDelete(transaction_id).session(session);
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
