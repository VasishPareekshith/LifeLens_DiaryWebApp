const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const transcribeService = new AWS.TranscribeService();

const BUCKET_NAME = 'lifelens-audio'; // Replace with your actual S3 bucket name


const uploadToS3 = async (fileBuffer, fileName) => {
    const s3Key = `audio/${fileName}`; // Use the file name directly

    const params = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileBuffer, 
        ContentType: 'audio/m4a', // Adjust according to your audio type
    };

    try {
        const s3Response = await s3.upload(params).promise();
        console.log('File uploaded successfully:', s3Response.Location);
        return s3Response.Location; // Return the S3 URL
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error; // Rethrow the error for further handling
    }
};

const startTranscriptionJob = async (jobName, mediaUri) => {
    const params = {
        TranscriptionJobName: jobName,
        LanguageCode: 'en-US', // Change to your language code
        Media: {
            MediaFileUri: mediaUri,
        },
        MediaFormat: 'mp4', // Change according to your audio format (m4a, mp3, etc.)
        OutputBucketName: BUCKET_NAME,
    };

    try {
        const data = await transcribeService.startTranscriptionJob(params).promise();
        console.log('Transcription job started:', data);
        return data; 
    } catch (error) {
        console.error('Error starting transcription job:', error);
        throw error; 
    }
};

const getTranscriptionJob = async (jobName) => {
    const params = {
        TranscriptionJobName: jobName,
    };

    try {
        const data = await transcribeService.getTranscriptionJob(params).promise();
        console.log('Transcription job status:', data);
        return data;
    } catch (error) {
        console.error('Error getting transcription job status:', error);
        throw error;
    }
};

module.exports = {
    uploadToS3,
    startTranscriptionJob,
    getTranscriptionJob,
};
