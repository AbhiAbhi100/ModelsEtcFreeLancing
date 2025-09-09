import express from 'express';
import { protect, requireRole } from '../middlewares/auth.js';
import { createOrUpdateProfile, getProfiles, getProfileById } from '../controllers/profileController.js';

const router = express.Router();

// @route   POST api/profiles
// @desc    Create or update a freelancer profile
// @access  Private (Freelancer only)
router.post('/', protect, requireRole('freelancer'), createOrUpdateProfile);

// @route   GET api/profiles
// @desc    Get all freelancer profiles with filters
// @access  Public
router.get('/', getProfiles);

// @route   GET api/profiles/:id
// @desc    Get a single freelancer profile by its ID
// @access  Public
router.get('/:id', getProfileById);

export default router;



//ek baar backend pura chal jaega to mere ko routes change karna hai
//sab ek hi me access nahi kar skata hu
