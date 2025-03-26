const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create a new task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, deadline } = req.body;
    
    console.log("Request Body:", req.body);
    console.log("User ID:", req.user);

    if (!title || !description || !deadline) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = new Task({ 
      title, description, category, deadline, userId: req.user.id 
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Get all tasks for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching tasks for user:", req.user.id);
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Get a single task by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log("Fetching task:", taskId);

    const task = await Task.findOne({ _id: taskId, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Update a task by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, deadline } = req.body;
    const taskId = req.params.id;

    console.log("Updating task:", taskId);

    // Find and update the task
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      { title, description, category, deadline },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ Delete a task by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log("Deleting task:", taskId);

    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
