const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = async (filePath, fileName) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName, // File name in S3
    Body: fileContent,
    ContentType: 'video/mp4', // Change if handling other types
  };

  return s3.upload(params).promise();
};

module.exports = { uploadToS3 };
