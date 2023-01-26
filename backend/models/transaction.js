const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    description: { type: String, required: true },
    category: { type: String, required: true },
    cashFlow: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    account: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
