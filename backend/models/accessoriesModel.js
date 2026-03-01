const mongoose = require("mongoose");

const accessoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    type: {
      type: String,
      enum: ["jewelry", "bag", "shoes", "hat", "belt"],
      required: true,
    },

    color: { type: String, required: true },

    compatibleWith: {
      type: [String],
    },

    image: {
      url: String,
      public_id: String,
    },

    wearCount: { type: Number, default: 0 },

    lastWorn: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "donated"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accessories", accessoriesSchema);
