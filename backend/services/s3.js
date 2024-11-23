const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const stream = require('stream');

// Initialize the S3 client using AWS SDK v3
const s3 = new S3Client({
  region: '###',
  credentials: {
    accessKeyId: '###',
    secretAccessKey: '###',
  },
});

// Multer configuration for uploading files to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'lifelens-images',
    key: (req, file, cb) => {
      cb(null, `images/${Date.now()}_${file.originalname}`);  // Customize the file name in S3
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB size limit
});

// Function to get an image from S3
const getImageFromS3 = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: 'lifelens-images',
      Key: key,
    });
    const response = await s3.send(command);

    // Stream the data back
    const bodyStream = new stream.PassThrough();
    response.Body.pipe(bodyStream);

    return {
      contentType: response.ContentType,
      bodyStream,
    };
  } catch (error) {
    console.error('Error getting image from S3:', error);
    throw error;
  }
};

module.exports = { upload, getImageFromS3 };
