const mongoose = require("mongoose");

const achievementsSchema = new mongoose.Schema(
  {
    title: String,
    description: [String],
    image: String,
    link: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

export const Achievements =
  mongoose.models.Achievements ||
  mongoose.model("Achievements", achievementsSchema);
