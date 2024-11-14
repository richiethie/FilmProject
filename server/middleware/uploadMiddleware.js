// uploadMiddleware.js
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS S3 (version 2)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// File filter to only allow video and image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only video and image files are allowed'), false); // Reject file
  }
};

// Setup multer to upload to S3 (version 2)
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      const fileType = file.fieldname === 'file' ? 'films' : 'thumbnails'; // Determine directory based on field name
      cb(null, `${fileType}/${uuidv4()}-${file.originalname}`); // Generate unique file name
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
});

module.exports = upload;
