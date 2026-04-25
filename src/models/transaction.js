const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    transactionRef: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    sender: {
      name: { type: String },
      acctNo: { type: String },
      required: true,
    },
    reciever: {
      name: { type: String },
      acctNo: { type: String },
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
      required: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
