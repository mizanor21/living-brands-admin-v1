import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  name: String,
  description: String,
  logo: String,
  isActive: Boolean,
});

export const Partnership =
  mongoose.models.Partnership || mongoose.model("Partnership", partnerSchema);
