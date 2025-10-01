import express from "express";
import User from "../models/User.js";
import FreelancerProfile from "../models/FreelancerProfile.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/users/:userId/ban", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot ban admin users" });
    }

    user.isBanned = true;
    await user.save();

    res.json({ message: "User banned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/users/:userId/unban", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    await user.save();

    res.json({ message: "User unbanned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/freelancers/:profileId/approve", async (req, res) => {
  try {
    const profile = await FreelancerProfile.findById(req.params.profileId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.approved = true;
    await profile.save();

    res.json({ message: "Profile approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;