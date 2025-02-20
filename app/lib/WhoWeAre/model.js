import mongoose from "mongoose";

const WhoWeAreSchema = new mongoose.Schema({
  title: String,
  sections: [
    {
      heading: String,
      text: [String],
      button: {
        text: String,
        link: String,
      },
      shortVideo: {
        src: String,
        alt: String,
      },
      longVideo: {
        src: String,
        alt: String,
      },
    },
  ],
});

export const WhoWeAre =
  mongoose.models.WhoWeAre || mongoose.model("WhoWeAre", WhoWeAreSchema);
