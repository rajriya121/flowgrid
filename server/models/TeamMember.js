import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: String, default: 'workspace' },
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
  status: { type: String, enum: ['invited', 'accepted'], default: 'invited' }
}, { timestamps: true });

export default mongoose.model("TeamMember", teamMemberSchema);
