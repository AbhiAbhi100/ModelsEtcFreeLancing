import mongoose from 'mongoose';

const freelancerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: String,
  category: {
    type: String,
    enum: ['bodyguard', 'anchor', 'actor', 'model', 'dancer', 'others'],
    default: 'others'
  },
  bio: String,
  hourlyRate: Number,
  dailyRate: Number,
  skills: [String],
  location: String,
  media: [{
    url: String,
    type: String, // 'image' or 'video'
    publicId: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  approved: {
    type: Boolean,
    default: true // Auto-approved for MVP
  }
}, { timestamps: true });

export default mongoose.model('FreelancerProfile', freelancerProfileSchema);