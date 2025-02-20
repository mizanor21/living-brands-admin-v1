import mongoose from "mongoose";

const edgeSchema = new mongoose.Schema(
  {
    title: String,
    description: [String], // Array of string,
    buttonText: String,
    buttonLink: String,
    image: String,
  },
  { timestamps: true }
);

export const Edge = mongoose.models.Edge || mongoose.model("Edge", edgeSchema);
