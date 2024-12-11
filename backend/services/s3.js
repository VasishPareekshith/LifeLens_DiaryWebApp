const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const stream = require('stream');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'lifelens-images',  //bucket name change accordingly
    key: (req, file, cb) => {
      cb(null, `images/${Date.now()}_${file.originalname}`);  
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB size limit
});

const getImageFromS3 = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: 'lifelens-images',  //bucket name change accordingly
      Key: key,
    });
    const response = await s3.send(command);

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
