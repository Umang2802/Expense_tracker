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

    if (req.token) {
      res.status(200).json({
        token,
        accounts,
        transactions,
        user,
        message: "Logged in successfully",
      });
    } else {
      res.status(200).json({
        accounts,
        transactions,
        user,
        message: req.message ? req.message : "",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getHomeData };
