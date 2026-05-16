import express from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const projects = await Project.find({});
  res.json(projects);
});

router.post("/", protect, async (req, res) => {
  const project = new Project(req.body);
  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

router.put("/:id", protect, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    Object.assign(project, req.body);
    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

export default router;
