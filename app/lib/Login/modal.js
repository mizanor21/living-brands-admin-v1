import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  role: { type: String, required: true },
  img: { type: String }, // URL or path to the user's profile image
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
