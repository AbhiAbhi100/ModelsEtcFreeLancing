import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  freelancerProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FreelancerProfile',
    required: true
  },
  message: String,
  proposedPrice: Number,
  status: {
    type: String,
    enum: ['pending', 'rejected', 'accepted'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const jobSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FreelancerProfile' // Assigned freelancer after proposal acceptance
  },
  title: String,
  description: String,
  jobDate: Date,
  durationType: {
    type: String,
    enum: ['hourly', 'daily'],
    default: 'hourly'
  },
  hoursOrDays: Number, // Number of hours or days
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending'
  },
  price: Number, // The budget set by the client
  proposals: [proposalSchema]
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);