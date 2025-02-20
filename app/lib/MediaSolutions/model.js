import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const brandSchema = new mongoose.Schema({
  id: String,
  logo: String,
});

const mediaSolutionsSchema = new mongoose.Schema({
  shortDescription: [String],
  items: [itemSchema],
  brand: [brandSchema],
});

export const MediaSolutions =
  mongoose.models.MediaSolutions ||
  mongoose.model("MediaSolutions", mediaSolutionsSchema);
