import mongoose, { Schema } from "mongoose";
import { IAccount } from "../types/index";

const accountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    acctNo: {
      type: String,
      maxlength: 10,
      trim: true,
      required: true,
      unique: true,
    },
    balance: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    bankCode: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IAccount>("Account", accountSchema);
