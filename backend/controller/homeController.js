const Account = require("../models/account");
const Transaction = require("../models/transaction");
// const con = require("../config/db");
const { default: mongoose } = require("mongoose");

const getHomeData = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const user = req.user;

      const accounts = await Account.find(
        {
          user: user.id,
        },
        null,
        { session }
      ).select("-user");

      const transactions = await Transaction.find(
        {
          user: user.id,
        },
        null,
        { session }
      )
        .populate({ path: "account", select: "name" })
        .select("-user");

      res.status(200).json({ accounts, transactions, user });
    });
    session.endSession();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getHomeData };
