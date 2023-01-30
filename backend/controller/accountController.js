const { default: mongoose } = require("mongoose");
const Account = require("../models/account");
const Transaction = require("../models/transaction");
const User = require("../models/user");

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
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let { name, amount } = req.body;
      let user = req.user;
      amount = Number(amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }

      const checkAccount = await Account.findOne({
        name: name,
        user: user._id,
      }).session(session);
      if (checkAccount) {
        res.status(400).json({ message: "Account already exists" });
        return;
      }

      req.body.user = user._id;
      const account = new Account(req.body);
      await account.save({ session });

      user.inflow += amount;
      await User.findByIdAndUpdate(user._id, user).session(session);
      const newAccount = await Account.findById(account._id)
        .session(session)
        .select("-user -_id");

      res.status(200).json(newAccount);
    });
    session.endSession();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateAccount = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let { amount } = req.body;
      let user = req.user;
      const account_id = req.params.id;
      amount = Number(amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }
      const checkAccount = await Account.findOne({
        _id: account_id,
        user: user._id,
      }).session(session);
      if (!checkAccount) {
        res.status(404).json({ message: "Account not found" });
        return;
      }

      const result = await Account.findByIdAndUpdate(account_id, req.body, {
        new: true,
      })
        .session(session)
        .select("-user -_id");

      let newInflow = user.inflow;
      newInflow -= checkAccount.amount;
      newInflow += amount;
      await User.findByIdAndUpdate(user._id, { inflow: newInflow }).session(
        session
      );
      res.status(200).json(result);
    });
    session.endSession();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const account_id = req.params.id;
      let user = req.user;

      const checkAccount = await Account.findById(account_id).session(session);
      if (!checkAccount) {
        res.status(404).json({ message: "Account not found" });
        return;
      }
      const transactions = await Transaction.find({
        account: account_id,
      }).session(session);

      user.inflow -= checkAccount.amount;
      transactions.forEach((transaction) => {
        if (transaction.cashFlow === "Income") {
          user.inflow -= transaction.amount;
        } else if (transaction.cashFlow === "Expense") {
          user.outflow -= transaction.amount;
        }
      });
      await User.findByIdAndUpdate(user._id, user).session(session);
      await Transaction.deleteMany({ account: account_id }).session(session);
      await Account.findByIdAndDelete(account_id).session(session);
      res.status(200).send();
    });
    session.endSession();
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
