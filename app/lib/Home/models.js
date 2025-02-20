import mongoose, { Schema } from "mongoose";

const homepageSchema = new mongoose.Schema({
  heroSection: {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  videoSection: {
    videoURL: { type: String },
  },
  elevateSection: {
    title: { type: String, required: true },
    shortDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  defineUsSection: {
    heading: { type: String },
    title: { type: String, required: true },
    shortDescription: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  slideshowSection: {
    slides: [
      {
        imageURL: { type: String },
      },
    ],
  },
  solutionSection: {
    solutions: [
      {
        id: { type: String, required: true },
        path: { type: String },
        title: { type: String, required: true },
        content: { type: String },
      },
    ],
  },
  journeySection: {
    title: { type: String },
    image: { type: String },
  },
  brandSection: {
    reviews: [
      {
        imageURL: { type: String },
      },
    ],
    partnerBrands: [
      {
        logoURL: { type: String },
      },
    ],
  },
});

export const Home =
  mongoose.models.Home || mongoose.model("Home", homepageSchema);
