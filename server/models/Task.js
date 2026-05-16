import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: { type: String }, // Storing as ISO date string
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
