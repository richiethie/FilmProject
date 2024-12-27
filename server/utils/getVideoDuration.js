const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');

// Function to get video duration using ffmpeg-static
const getVideoDuration = (fileUrl) => {
  try {
    const result = execSync(`${ffmpeg} -i ${fileUrl} -f ffmetadata -`).toString();
    const match = result.match(/duration=([^\\n]+)/);
    if (match) {
      const duration = match[1].trim();
      return parseFloat(duration);
    } else {
      throw new Error('Duration not found');
    }
  } catch (error) {
    console.error('Error getting video duration:', error);
    return null;
  }
};

module.exports = getVideoDuration;
