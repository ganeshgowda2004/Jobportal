const Job = require('../models/job');

exports.createJob = async (req, res) => {
    const { title, description, company, location } = req.body;
    const newJob = new Job({ title, description, company, location, postedBy: req.user.id });
    await newJob.save();
    
    res.status(201).json(newJob);
};

exports.getJobs = async (req, res) => {
    const jobs = await Job.find().populate('postedBy', 'username');
    res.json(jobs);
};
