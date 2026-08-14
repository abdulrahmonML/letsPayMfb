import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/index";

const userSchema = new Schema<IUser>(
  {
    name: {
      firstName: { type: String, maxlength: 100, trim: true },
      lastName: { type: String, maxlength: 100, trim: true },
    },
    phone: { type: String, required: true, maxlength: 11, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      maxlength: 50,
      trim: true,
    },
    password: { type: String, required: true },
    dob: { type: String, required: true, maxlength: 10, trim: true },
    ninId: { type: Schema.Types.ObjectId, ref: "Nin" },
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model<IUser>("User", userSchema);
