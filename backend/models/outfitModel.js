const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    clothingItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clothes",
      },
    ],

    accessories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accessories",
      },
    ],

    weatherCondition: {
      type: String,
    },

    outfitImages: {
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
        message: "Maximum of 5 outfit images allowed",
      },
    },

    wearCount: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model("Outfit", outfitSchema);
