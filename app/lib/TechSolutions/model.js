import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const brandSchema = new mongoose.Schema({
  id: String,
  logo: String,
});

const techSolutionsSchema = new mongoose.Schema({
  shortDescription: [String],
  items: [itemSchema],
  brand: [brandSchema],
});

export const TechSolutions =
  mongoose.models.TechSolutions ||
  mongoose.model("TechSolutions", techSolutionsSchema);
