import mongoose from "mongoose";

const slideshowSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
  },
  { timestamps: true }
);

export const Slideshow = mongoose.models.Slideshow || mongoose.model("Slideshow", slideshowSchema);