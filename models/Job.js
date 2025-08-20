
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "FreelancerProfile", required: true },
    title: { type: String, required: true },
    description: String,
    jobDate: { type: Date, required: true },
    durationType: { type: String, enum: ["hourly", "daily"], required: true },
    hoursOrDays: { type: Number, min: 1, default: 1 },
    price: { type: Number, min: 0, required: true },
    status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
