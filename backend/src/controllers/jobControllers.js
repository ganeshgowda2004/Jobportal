const Job = require('../models/job');
const Application = require('../models/application');
const { validationResult } = require('express-validator');

exports.createJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, company, location } = req.body;
        const newJob = new Job({ title, description, company, location, postedBy: req.user.id });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'username');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.applyForJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { jobId } = req.params;
        const { coverLetter, resumeUrl } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const uploadedResumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : resumeUrl;

        const application = new Application({
            job: jobId,
            applicant: req.user.id,
            coverLetter,
            resumeUrl: uploadedResumeUrl,
        });
        await application.save();
        res.status(201).json({ message: 'Application submitted', application });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'You have already applied to this job' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getApplicationsForJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (String(job.postedBy) !== String(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to view applications for this job' });
        }

        const applications = await Application.find({ job: jobId })
            .populate('applicant', 'username email')
            .sort({ createdAt: -1 });

        res.json(applications.map(a => ({
            id: a._id,
            applicant: {
                username: a.applicant?.username,
                email: a.applicant?.email,
            },
            resumeUrl: a.resumeUrl,
            coverLetter: a.coverLetter,
            status: a.status,
            appliedAt: a.appliedAt,
        })));
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findById(applicationId).populate('job');
        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (String(application.job.postedBy) !== String(req.user.id)) {
            return res.status(403).json({ message: 'You are not authorized to update this application' });
        }

        application.status = status;
        await application.save();
        res.json({ message: 'Status updated', status: application.status });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
