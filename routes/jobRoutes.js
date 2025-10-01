import express from "express";
import Job from "../models/Job.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "client") {
      query.client = req.user.id;
    } else if (req.user.role === "freelancer") {
      const FreelancerProfile = (await import("../models/FreelancerProfile.js")).default;
      const profile = await FreelancerProfile.findOne({ user: req.user.id });
      if (profile) {
        query.freelancer = profile._id;
      }
    }

    const jobs = await Job.find(query)
      .populate("client", "name email")
      .populate({
        path: "freelancer",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("client", "name email")
      .populate({
        path: "freelancer",
        populate: { path: "user", select: "name email" },
      })
      .populate("payment");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can create jobs" });
    }

    const job = await Job.create({
      client: req.user.id,
      ...req.body,
    });

    await job.populate("client", "name email");
    await job.populate({
      path: "freelancer",
      populate: { path: "user", select: "name email" },
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.status = status;
    await job.save();

    await job.populate("client", "name email");
    await job.populate({
      path: "freelancer",
      populate: { path: "user", select: "name email" },
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;