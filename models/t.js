const mongoose = require("mongoose");

const tSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
    dc: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("T", tSchema);
