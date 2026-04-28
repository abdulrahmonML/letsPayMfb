const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    nibssTransactionId: {
      type: String,
      default: null,
    },
    transactionRef: {
      type: String,
    },
    amount: {
      type: Number,
    },
    sender: {
      name: { type: String },
      acctNo: { type: String },
    },
    recipient: {
      name: { type: String },
      acctNo: { type: String },
    },
    type: {
      type: String,
      emum: ["sendMoney", "recieveMoney"],
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    idempotencyKey: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
