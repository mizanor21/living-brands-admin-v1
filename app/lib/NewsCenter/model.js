import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    category: String,
    title: String,
    img: String,
    description: String,
  },
  { timestamps: true }
);

export const News = mongoose.models.News || mongoose.model("News", newsSchema);
