import express from "express";
import FreelancerProfile from "../models/FreelancerProfile.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category, isAvailable, search } = req.query;

    let query = { approved: true };

    if (category) query.category = category;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === "true";

    const profiles = await FreelancerProfile.find(query).populate("user", "name email");

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const profile = await FreelancerProfile.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const existingProfile = await FreelancerProfile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = await FreelancerProfile.create({
      user: req.user.id,
      ...req.body,
    });

    await profile.populate("user", "name email");
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const profile = await FreelancerProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProfile = await FreelancerProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("user", "name email");

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;