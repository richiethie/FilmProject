const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize MediaConvert
const mediaConvert = new AWS.MediaConvert({
  region: process.env.AWS_REGION,
  endpoint: process.env.MEDIA_CONVERT_ENDPOINT, // You can get this from your AWS Console
});

// Function to create a job to extract metadata (including duration)
const createMediaConvertJob = async (videoFileS3Url) => {
  const jobSettings = {
    Role: process.env.AWS_IAM_ROLE_ARN, // The IAM role with MediaConvert permissions
    Settings: {
      OutputGroups: [
        {
          OutputGroupSettings: {
            Type: 'FileGroup',
            FileGroupSettings: {
              Destination: `s3://${process.env.AWS_S3_BUCKET_NAME}/media-convert-output/`,
            },
          },
          Outputs: [
            {
              ContainerSettings: {
                Container: 'RAW',
              },
              VideoDescription: {
                CodecSettings: {
                  Codec: 'H_264', // Use the codec appropriate for your video
                },
              },
            },
          ],
        },
      ],
      Inputs: [
        {
          FileInput: videoFileS3Url,
        },
      ],
    },
  };

  try {
    const data = await mediaConvert.createJob(jobSettings).promise();
    console.log('MediaConvert job created successfully:', data);
    return data; // The response contains job details
  } catch (error) {
    console.error('Error creating MediaConvert job:', error);
    throw new Error('Error creating MediaConvert job');
  }
};

module.exports = { createMediaConvertJob };
