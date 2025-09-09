import Job from '../models/Job.js';
import FreelancerProfile from '../models/FreelancerProfile.js';

export const createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, client: req.user._id };
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listJobs = async (req, res) => {
  const { status, q, durationType } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (durationType) filter.durationType = durationType;
  if (q) filter.title = new RegExp(q, 'i');

  try {
    const jobs = await Job.find(filter)
      .populate('client', 'name email')
      .populate('freelancer', 'displayName');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name email')
      .populate({
        path: 'proposals.freelancerProfile',
        select: 'displayName user',
        populate: { path: 'user', select: 'name email' }
      })
      .populate('freelancer');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const profile = await FreelancerProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ message: 'You must have a freelancer profile to apply' });

    // 1) Check if job exists
    const job = await Job.findById(jobId).select('_id');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // 2) Atomic check: is there already a proposal by this profile?
    const already = await Job.findOne({ _id: jobId, 'proposals.freelancerProfile': profile._id }).lean();
    if (already) return res.status(400).json({ message: 'You have already applied to this job' });

    // 3) Build proposal
    const { message, proposedPrice } = req.body;
    const newProposal = {
      freelancerProfile: profile._id,
      message: message || '',
      proposedPrice: proposedPrice == null ? null : proposedPrice,
      status: 'pending'
    };

    // 4) Atomic push with validation
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $push: { proposals: newProposal } },
      { new: true, runValidators: true }
    ).populate('proposals.freelancerProfile', 'displayName user');

    if (!updatedJob) return res.status(500).json({ message: 'Could not add proposal' });

    // Grab the newly added proposal (last element)
    const addedProposal = updatedJob.proposals[updatedJob.proposals.length - 1];

    return res.status(201).json({ message: 'Application submitted successfully', proposal: addedProposal });
  } catch (err) {
    console.error('applyToJob error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};


export const respondToProposal = async (req, res) => {
  try {
    const { id, proposalId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const job = await Job.findById(id);

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.client.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You are not authorized to manage this job' });

    const proposal = job.proposals.id(proposalId);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    if (action === 'accept') {
      proposal.status = 'accepted';
      job.freelancer = proposal.freelancerProfile;
      job.status = 'accepted';
      job.proposals.forEach(p => {
        if (p._id.toString() !== proposalId) p.status = 'rejected';
      });
      await job.save();
      return res.json({ message: 'Proposal accepted' });
    } else if (action === 'reject') {
      proposal.status = 'rejected';
      await job.save();
      return res.json({ message: 'Proposal rejected' });
    } else {
      return res.status(400).json({ message: 'Invalid action provided' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const { status } = req.body;
    const isClient = req.user.role === 'client' && job.client.toString() === req.user._id.toString();
    
    let isAssignedFreelancer = false;
    if (req.user.role === 'freelancer' && job.freelancer) {
        const profile = await FreelancerProfile.findOne({ user: req.user._id });
        if (profile && job.freelancer.toString() === profile._id.toString()) {
            isAssignedFreelancer = true;
        }
    }

    if (!isClient && !isAssignedFreelancer) {
        return res.status(403).json({ message: 'You are not authorized to update this job' });
    }

    // Example logic: Only client can mark as 'completed'
    if (status === 'completed' && !isClient) {
        return res.status(403).json({ message: 'Only the client can mark the job as completed.' });
    }
    
    job.status = status;
    await job.save();
    return res.json({ message: 'Job status updated successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const myJobs = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'This route is for clients only' });
    }
    const jobs = await Job.find({ client: req.user._id })
      .populate('proposals.freelancerProfile', 'displayName');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const myApplications = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
        return res.status(403).json({ message: 'This route is for freelancers only' });
    }
    const profile = await FreelancerProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ message: 'Please create a profile first' });

    const jobs = await Job.find({ 'proposals.freelancerProfile': profile._id })
      .populate('client', 'name email');
      
    const result = jobs.map(job => {
        const myProposal = job.proposals.find(p => p.freelancerProfile.toString() === profile._id.toString());
        return {
            jobId: job._id,
            title: job.title,
            client: job.client,
            jobStatus: job.status,
            proposal: myProposal
        };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};