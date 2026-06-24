import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Remote"],
    default: "Full-time"
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true })

export default mongoose.model("Job", jobSchema)
