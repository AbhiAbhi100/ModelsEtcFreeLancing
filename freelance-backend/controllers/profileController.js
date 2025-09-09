import FreelancerProfile from '../models/FreelancerProfile.js';

export const createOrUpdateProfile = async (req, res) => {
  const userId = req.user._id;
  const profileData = req.body;

  try {
    let profile = await FreelancerProfile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile = await FreelancerProfile.findOneAndUpdate(
        { user: userId },
        { $set: profileData },
        { new: true, runValidators: true }
      );
      return res.json(profile);
    }

    // Create new profile
    profileData.user = userId;
    profile = await FreelancerProfile.create(profileData);
    return res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfiles = async (req, res) => {
  const { skill, category, location, q } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (location) filter.location = new RegExp(location, 'i'); // Case-insensitive search
  if (skill) filter.skills = { $in: [new RegExp(skill, 'i')] }; // Case-insensitive search
  if (q) filter.displayName = new RegExp(q, 'i'); // Search by name

  try {
    const profiles = await FreelancerProfile.find(filter).populate('user', 'name email');
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const profile = await FreelancerProfile.findById(req.params.id).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};