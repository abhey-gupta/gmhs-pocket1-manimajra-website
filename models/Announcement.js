const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    file: { type: String },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Announcement", AnnouncementSchema);
