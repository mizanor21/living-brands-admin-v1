import mongoose from "mongoose";

const jobHeroSchema = new mongoose.Schema(
  {
    summary: String,
    title: String,
    description: String,
    image: String,
  },
  { timestamps: true }
);

export const JobHero =
  mongoose.models.JobHero || mongoose.model("JobHero", jobHeroSchema);
