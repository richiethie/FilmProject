const AWS = require('aws-sdk');

// Configure AWS S3 with the access keys you saved earlier
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your Secret Access Key
  region: 'your-region', // e.g. 'us-west-2'
});

const s3 = new AWS.S3();

module.exports = s3;
