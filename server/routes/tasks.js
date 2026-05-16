import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const tasks = await Task.find({});
  res.json(tasks);
});

router.post("/", protect, async (req, res) => {
  const task = new Task(req.body);
  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

router.put("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    await task.deleteOne();
    res.json({ message: "Task removed" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

export default router;
