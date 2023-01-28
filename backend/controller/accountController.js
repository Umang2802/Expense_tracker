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
      const { name, amount } = req.body;
      const user_id = req.user._id;
      amount = Number(amount);

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }

      const checkAccount = await Account.findOne(
        {
          name: name,
          user: user_id,
        },
        null,
        { session }
      );
      if (checkAccount) {
        res.status(400).json({ message: "Account already exists" });
        return;
      }

      req.body.user = user_id;
      const account = new Account(req.body);
      await account.save({ session });

      const user = await User.findById(user_id, null, { session });
      user.inflow += amount;
      await User.findByIdAndUpdate(user_id, user, { session });
      const newAccount = await Account.findById(account._id, null, {
        session,
      }).select("-user -_id");

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
      const { amount } = req.body;
      amount = Number(amount)

      if (amount < 0) {
        res.status(400).json({ message: "Amount can't be negative" });
        return;
      }
      const checkAccount = await Account.findById(req.params.id, null, {
        session,
      });
      if (!checkAccount) {
        res.status(404).json({ message: "Account not found" });
        return;
      }

      const result = await Account.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
        null,
        { session }
      ).select("-user -_id");

      let newInflow = req.user.inflow;
      newInflow -= checkAccount.amount;
      newInflow += amount;
      await User.findByIdAndUpdate(req.user._id, { inflow: newInflow }, null, {
        session,
      });
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
      const checkAccount = await Account.findById(account_id, null, {
        session,
      });
      if (!checkAccount) {
        res.status(404).json({ message: "Account not found" });
        return;
      }
      const transactions = await Transaction.find(
        { account: account_id },
        null,
        {
          session,
        }
      );
      let inflow = 0,
        outflow = 0;
      transactions.forEach((transaction) => {
        if (transaction.cashFlow === "Income") {
          inflow += transaction.amount;
        } else if (transaction.cashFlow === "Expense") {
          outflow += transaction.amount;
        }
      });
      await User.findByIdAndUpdate(req.user._id, { inflow, outflow }, null, {
        session,
      });
      await Transaction.deleteMany({ account: account_id }, null, {
        session,
      });
      await Account.findByIdAndDelete(account_id, null, {
        session,
      });
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
