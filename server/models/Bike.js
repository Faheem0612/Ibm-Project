const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Road", "Mountain", "City", "Electric", "Kids"],
      default: "City",
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bike", bikeSchema);
