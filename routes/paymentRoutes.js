import express from "express";
import Payment from "../models/Payment.js";
import Job from "../models/Job.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:jobId", protect, async (req, res) => {
  try {
    const { amount, receiptEmail } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (job.payment) {
      return res.status(400).json({ message: "Payment already exists for this job" });
    }

    const payment = await Payment.create({
      job: req.params.jobId,
      amount,
      receiptEmail,
      provider: "mock",
      status: "succeeded",
      providerPaymentId: `mock_${Date.now()}`,
    });

    job.payment = payment._id;
    await job.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/job/:jobId", protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ job: req.params.jobId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;