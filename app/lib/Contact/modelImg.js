import mongoose from "mongoose";

const ContactImgSchema = new mongoose.Schema(
  {
    img: String,
  },
  { timestamps: true }
);

export const ContactImg =
  mongoose.models.ContactImg || mongoose.model("ContactImg", ContactImgSchema);
