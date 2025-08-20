import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    provider: { type: String, enum: ["mock", "stripe"], default: "mock" },
    status: { type: String, enum: ["pending", "succeeded", "failed", "refunded"], default: "pending" },
    providerPaymentId: String,
    receiptEmail: String
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
