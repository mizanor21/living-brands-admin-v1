import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const brandSchema = new mongoose.Schema({
  id: String,
  logo: String,
});

const brandSolutionsSchema = new mongoose.Schema({
  shortDescription: [String],
  items: [itemSchema],
  brand: [brandSchema],
});

export const BrandSolutions =
  mongoose.models.BrandSolutions ||
  mongoose.model("BrandSolutions", brandSolutionsSchema);
