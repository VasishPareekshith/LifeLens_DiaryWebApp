import boto3
from botocore.exceptions import ClientError
from flask import Flask

app = Flask(__name__)

# AWS Credentials and S3 Configuration
AWS_ACCESS_KEY_ID = '###'
AWS_SECRET_ACCESS_KEY = '###'
REGION_NAME = '###'
BUCKET_NAME = 'your_bucket_name'  # Replace with your actual S3 bucket name

# Initialize AWS S3 and Transcribe service clients
s3 = boto3.client('s3', 
                  aws_access_key_id=AWS_ACCESS_KEY_ID,
                  aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                  region_name=REGION_NAME)

transcribe_client = boto3.client('transcribe', 
                                 aws_access_key_id=AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                                 region_name=REGION_NAME)

# Function to upload audio file to S3
def upload_to_s3(file_buffer, file_name):
    s3_key = f'audio/{file_name}'  # Use the file name directly
    try:
        s3.put_object(Bucket=BUCKET_NAME, Key=s3_key, Body=file_buffer, ContentType='audio/m4a')
        file_url = f'https://{BUCKET_NAME}.s3.{REGION_NAME}.amazonaws.com/{s3_key}'
        print(f'File uploaded successfully: {file_url}')
        return file_url  # Return the S3 URL
    except ClientError as e:
        print(f'Error uploading to S3: {e}')
        raise e

# Function to start a transcription job
def startTranscriptionJob(job_name, media_uri):
    try:
        response = transcribe_client.start_transcription_job(
            TranscriptionJobName=job_name,
            LanguageCode='en-US',  # Change to your language code
            Media={'MediaFileUri': media_uri},
            MediaFormat='mp4',  # Change according to your audio format (m4a, mp3, etc.)
            OutputBucketName=BUCKET_NAME
        )
        print(f'Transcription job started: {response}')
        return response
    except ClientError as e:
        print(f'Error starting transcription job: {e}')
        raise e

# Function to get the status of a transcription job
def getTranscriptionJob(job_name):
    try:
        response = transcribe_client.get_transcription_job(
            TranscriptionJobName=job_name
        )
        print(f'Transcription job status: {response}')
        return response
    except ClientError as e:
        print(f'Error getting transcription job status: {e}')
        raise e


if __name__ == '__main__':
    app.run(debug=True)
