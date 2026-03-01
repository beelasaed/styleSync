const mongoose = require("mongoose");

const clothesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: String,
      enum: ["top", "bottom", "dress", "suit", "outerwear", "footwear"],
      required: true,
    },

    color: { type: String, required: true },

    season: {
      type: [String],
    },

    occasion: {
      type: [String],
    },

    images: {
      type: [
        {
          url: String,
          public_id: String,
        },
      ],
      validate: {
        validator: function (val) {
          return val.length <= 5;
        },
        message: "Maximum of 5 images allowed",
      },
    },

    wearCount: { type: Number, default: 0 },

    lastWorn: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "donated", "sold", "laundry"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clothes", clothesSchema);
