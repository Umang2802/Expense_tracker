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
    res
      .status(200)
      .json({ transactions, message: "Fetched all transactions successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const addTransaction = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const { account, cashFlow } = req.body;
      let { amount } = req.body;
      let user = await User.findById(req.userId);
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

      req.message = "Added transaction successfully";
      req.userId = user._id;
    });
    session.endSession();
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let user = await User.findById(req.userId);
      const transaction_id = req.params.id;
      const { account } = req.body;
      let { amount } = req.body;
      amount = Number(amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }
      const oldTransaction = await Transaction.findOne({
        _id: transaction_id,
        user: user._id,
      }).session(session);
      if (!oldTransaction) {
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

      req.body.account = checkAccount._id;
      const newTransaction = await Transaction.findByIdAndUpdate(
        transaction_id,
        req.body,
        { new: true }
      ).session(session);

      if (oldTransaction.cashFlow === "Income") {
        user.inflow -= oldTransaction.amount;
      } else if (oldTransaction.cashFlow === "Expense") {
        user.outflow -= oldTransaction.amount;
      }
      //if Old account is not same as new account
      if (!newTransaction.account.equals(oldTransaction.account)) {
        let checkOldAccount = await Account.findOne({
          _id: oldTransaction.account,
          user: user._id,
        }).session(session);
        if (!checkOldAccount) {
          res.status(404).json({ message: "Old Account not found" });
          return;
        }
        if (oldTransaction.cashFlow === "Income") {
          checkOldAccount.amount -= oldTransaction.amount;
        } else if (oldTransaction.cashFlow === "Expense") {
          checkOldAccount.amount += oldTransaction.amount;
        }
        await Account.findByIdAndUpdate(
          checkOldAccount._id,
          checkOldAccount
        ).session(session);
      } else {
        if (oldTransaction.cashFlow === "Income") {
          checkAccount.amount -= oldTransaction.amount;
        } else if (oldTransaction.cashFlow === "Expense") {
          checkAccount.amount += oldTransaction.amount;
        }
      }

      //updating inflow, outflow and new account according to new transaction amount
      if (newTransaction.cashFlow === "Income") {
        user.inflow += newTransaction.amount;
        checkAccount.amount += newTransaction.amount;
      } else if (newTransaction.cashFlow === "Expense") {
        user.outflow += newTransaction.amount;
        const diff = checkAccount.amount - newTransaction.amount;
        if (diff < 0) {
          res.status(400).json({ message: "Not enough balance in account" });
          await session.abortTransaction();
          return;
        }
        checkAccount.amount -= newTransaction.amount;
      }

      await Account.findByIdAndUpdate(checkAccount._id, checkAccount).session(
        session
      );

      await User.findByIdAndUpdate(user._id, user).session(session);

      req.message = "Updated transaction successfully";
      req.userId = user._id;
    });
    session.endSession();
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let user = await User.findById(req.userId);
      const transaction_id = req.params.id;
      const checkTransaction = await Transaction.findOne({
        _id: transaction_id,
        user: user._id,
      }).session(session);
      if (!checkTransaction) {
        res.status(404).json({ message: "Transaction not found" });
        return;
      }

      let checkAccount = await Account.findOne({
        _id: checkTransaction.account,
        user: user._id,
      }).session(session);
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
      req.message = "Successfully deleted transaction";
      req.userId = user._id;
    });
    session.endSession();
    next();
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
