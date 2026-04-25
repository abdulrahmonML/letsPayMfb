const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      firstName: {
        type: String,
        maxlength: 100,
        trim: true,
      },
      lastName: {
        type: String,
        maxlength: 100,
        trim: true,
      },
      required: true,
    },
    phone: {
      type: String,
      required: true,
      maxlength: 11,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      maxlength: 50,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
      maxlength: 10,
      trim: true,
    },
    bvnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bvn",
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  { timestamps: true },
);

const bcrypt = require("bcryptjs");
userSchema.pre("save", async function () {
  // If password isn't changed, just stop (don't call next)
  if (!this.isModified("password")) return;

  // Hash the password
  this.password = await bcrypt.hash(this.password, 10);

  // In async hooks, simply returning (or finishing) acts as next()
});

module.exports = mongoose.model("User", userSchema);
