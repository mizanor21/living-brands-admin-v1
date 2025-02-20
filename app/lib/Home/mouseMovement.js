import mongoose, { Schema } from "mongoose";

const mouseMovementSchema = new mongoose.Schema({
  id: { type: String },
  path: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  color: { type: String, match: /^#[0-9A-F]{6}$/i }, // Validates hex color code
});

export const MouseMovement =
  mongoose.models.MouseMovement ||
  mongoose.model("MouseMovement", mouseMovementSchema);
