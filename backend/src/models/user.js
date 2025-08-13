const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['recruiter', 'applicant'], default: 'applicant', required: true },
});

module.exports = mongoose.model('User', userSchema);
