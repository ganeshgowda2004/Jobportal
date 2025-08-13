const express = require('express');
const { body, param } = require('express-validator');
const { createJob, getJobs, applyForJob, getApplicationsForJob, updateApplicationStatus } = require('../controllers/jobControllers');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const router = express.Router();

// Recruiter-only: create job
router.post(
    '/',
    authMiddleware,
    authorizeRoles('recruiter'),
    [
        body('title').isString().trim().isLength({ min: 3 }),
        body('description').isString().isLength({ min: 10 }),
        body('company').isString().trim().notEmpty(),
        body('location').isString().trim().notEmpty(),
    ],
    createJob
);

// Public/applicant: list jobs
router.get('/', getJobs);

// Applicant-only: apply to a job (optional resume upload)
router.post(
    '/:jobId/apply',
    authMiddleware,
    authorizeRoles('applicant'),
    param('jobId').isMongoId(),
    upload.single('resume'),
    applyForJob
);

// Recruiter-only: view applications for a job they posted
router.get(
    '/recruiter/applications/:jobId',
    authMiddleware,
    authorizeRoles('recruiter'),
    param('jobId').isMongoId(),
    getApplicationsForJob
);

// Recruiter-only: update application status
router.patch(
    '/applications/:applicationId/status',
    authMiddleware,
    authorizeRoles('recruiter'),
    [param('applicationId').isMongoId(), body('status').isIn(['Pending', 'Reviewed', 'Accepted', 'Rejected'])],
    updateApplicationStatus
);

module.exports = router;
