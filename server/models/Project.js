import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["active", "on-hold", "completed"], default: "active" },
  memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  color: { type: String }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
