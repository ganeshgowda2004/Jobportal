const multer = require('multer');
const path = require('path');
const fs = require('fs');

const resumesDir = path.join(__dirname, '../../uploads/resumes');
fs.mkdirSync(resumesDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, resumesDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
    }
});

const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF or DOC/DOCX files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { upload };