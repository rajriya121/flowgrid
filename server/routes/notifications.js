import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

router.put("/:id/read", protect, async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification && notification.userId.toString() === req.user._id.toString()) {
    notification.read = true;
    await notification.save();
    res.json(notification);
  } else {
    res.status(404).json({ message: "Notification not found" });
  }
});

router.post("/", protect, async (req, res) => {
  // Allow creating notifications for other users
  const notification = new Notification(req.body);
  const createdNotification = await notification.save();
  res.status(201).json(createdNotification);
});

export default router;
