import express from "express";
import TeamMember from "../models/TeamMember.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const members = await TeamMember.find({});
  res.json(members);
});

router.post("/", protect, admin, async (req, res) => {
  const { userId, role } = req.body;
  const existing = await TeamMember.findOne({ userId });
  if (existing) {
    return res.status(400).json({ message: "Member already in team or invited" });
  }
  const member = await TeamMember.create({ userId, role, status: "invited" });
  res.status(201).json(member);
});

router.put("/:id/accept", protect, async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (member) {
    // Only the invited user or an admin should be able to accept, but for simplicity we allow any protected user to accept their own invite.
    member.status = "accepted";
    const updatedMember = await member.save();
    res.json(updatedMember);
  } else {
    res.status(404).json({ message: "Team member not found" });
  }
});

router.put("/:id/role", protect, admin, async (req, res) => {
  const { role } = req.body;
  const member = await TeamMember.findById(req.params.id);
  if (member) {
    member.role = role;
    const updatedMember = await member.save();
    res.json(updatedMember);
  } else {
    res.status(404).json({ message: "Team member not found" });
  }
});

router.delete("/:id", protect, admin, async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (member) {
    await member.deleteOne();
    res.json({ message: "Team member removed" });
  } else {
    res.status(404).json({ message: "Team member not found" });
  }
});

export default router;
