const mongoose = require("mongoose");

const bvnSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bvnNo: {
      type: String,
      required: true,
      maxlength: 11,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bvn", bvnSchema);
