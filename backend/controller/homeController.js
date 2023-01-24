const Account = require("../models/account");
const Transaction = require("../models/transaction");
const User = require("../models/user");

const getHomeData = async (req, res) => {
  try {
    const checkUser = await User.findById(req.user_id);
    if (!checkUser) {
      res.status(404).json({ message: "User does not exist" });
      return;
    }
    const accounts = await Account.find({
      user: req.user_id,
    }).select("-user");
    const transactions = await Transaction.find({
      user: req.user_id,
    })
      .populate("account", "name")
      .select("-user");
    res.status(200).json({ accounts, transactions });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getHomeData };
