import mongoose, { Schema } from "mongoose";

const introVideoSchema = new mongoose.Schema({
  imageUrl: { type: String },
  //   path: { type: String },
});

export const IntroVideo =
  mongoose.models.IntroVideo || mongoose.model("IntroVideo", introVideoSchema);
