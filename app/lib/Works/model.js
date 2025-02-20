import mongoose from "mongoose"

const workSchema = new mongoose.Schema(
  {
    category: { type: String, },
    thumbnail: { type: String },
    title: { type: String, },
    detailsTitle: { type: String, },
    services: [
      {
        serviceName: { type: String, },
        description: { type: String, },
      },
    ],
    serviceDetails: { type: String, },
    industry: { type: String, },
    img: { type: String },
    videoIframeURL: { type: String },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Works = mongoose.models.Works || mongoose.model("Works", workSchema)

