import mongoose, { Schema } from "mongoose";

const teamMemberSchema = new Schema(
  {
    id: Number,
    image: String,
    name: String,
    title: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

export const Teams =
  mongoose.models.Teams || mongoose.model("Teams", teamMemberSchema);
