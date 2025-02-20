import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  description: String,
});

export const ColorPalate =
  mongoose.models.ColorPalate || mongoose.model("ColorPalate", colorSchema);
