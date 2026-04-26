const mongoose = require("mongoose");

const ninSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

module.exports = mongoose.model("Nin", ninSchema);
