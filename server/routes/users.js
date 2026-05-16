import express from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

router.put("/:id/role", protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export default router;
