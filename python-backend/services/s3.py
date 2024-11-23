import boto3
from botocore.exceptions import NoCredentialsError
import os

# Initialize S3 client
s3_client = boto3.client('s3', region_name='###')

# Upload file content to S3
def uploadToS3(file_content, file_name):
    try:
        # Upload file content to S3 bucket
        s3_client.put_object(
            Bucket='Your_s3_bucket',  # Your S3 bucket name
            Key=file_name,
            Body=file_content,  # Directly upload the file content
            ContentType='application/octet-stream'  # Change based on file type (image, audio, etc.)
        )

        # Generate the file URL
        file_url = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_DEFAULT_REGION')}.amazonaws.com/{file_name}"
        return file_url
    except NoCredentialsError:
        raise Exception("Credentials not available")
    except Exception as e:
        raise Exception(f"Error uploading file: {str(e)}")
