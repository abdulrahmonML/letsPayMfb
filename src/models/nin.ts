import mongoose, { Schema } from "mongoose";
import { INin } from "../types/index";

const ninSchema = new Schema<INin>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ninNo: {
      type: String,
      required: true,
      maxlength: 11,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<INin>("Nin", ninSchema);
