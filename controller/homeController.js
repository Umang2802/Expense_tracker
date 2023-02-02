const Account = require("../models/account");
const Transaction = require("../models/transaction");

const getHomeData = async (req, res) => {
  try {
    const user = req.user;

    const accounts = await Account.find({
      user: user.id,
    }).select("-user");

    const transactions = await Transaction.find({
      user: user.id,
    })
      .populate({ path: "account", select: "name" })
      .select("-user");

    res.status(200).json({ accounts, transactions, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getHomeData };
