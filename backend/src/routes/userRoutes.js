const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/userControllers');
const router = express.Router();

router.post(
    '/register',
    [
        body('username').isString().trim().isLength({ min: 3 }),
        body('password').isString().isLength({ min: 6 }),
        body('email').optional().isEmail(),
        body('role').optional().isIn(['recruiter', 'applicant'])
    ],
    register
);

router.post(
    '/login',
    [
        body('username').isString().trim().notEmpty(),
        body('password').isString().notEmpty()
    ],
    login
);

module.exports = router;
