import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../types/index";

const transactionSchema = new Schema<ITransaction>(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
    nibssTransactionId: { type: String, default: null },
    transactionRef: { type: String },
    amount: { type: Number },
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
      enum: ["DEBIT", "CREDIT"],
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    idempotencyKey: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
