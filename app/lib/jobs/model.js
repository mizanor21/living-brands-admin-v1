import mongoose from "mongoose";

const JobCircularSchema = new mongoose.Schema({
  jobId: { type: String },
  title: { type: String, required: true },
  company: {
    name: { type: String, required: true },
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  location: {
    type: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
    },
    city: String,
    country: String,
  },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
  },
  experienceLevel: {
    type: String,
    enum: ["Entry-level", "Mid-level", "Senior-level", "Director"],
  },
  industry: String,
  department: String,
  openings: { type: Number, min: 1 },
  description: String,
  responsibilities: [String],
  requirements: {
    education: String,
    experience: String,
  },
  skills: [String],
  languages: [String],
  salary: {
    currency: String,
    min: Number,
    max: Number,
    frequency: {
      type: String,
      enum: ["Hourly", "Weekly", "Monthly", "Yearly"],
    },
  },
  benefits: [String],
  applicationDetails: {
    deadline: Date,
    link: String,
    contactEmail: { type: String, match: /^\S+@\S+\.\S+$/ },
    instructions: String,
  },
  // postingDate: { type: Date, default: Date.now },
  keywords: [String],
});

export const JobCircular =
  mongoose.models.JobCircular ||
  mongoose.model("JobCircular", JobCircularSchema);
