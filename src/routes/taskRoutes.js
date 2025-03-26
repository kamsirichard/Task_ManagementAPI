const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, deadline } = req.body;
    const task = new Task({ user: req.user.id, title, description, category, deadline });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get User's Tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// Update Task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Task
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Task deleted" });
});

module.exports = router;
