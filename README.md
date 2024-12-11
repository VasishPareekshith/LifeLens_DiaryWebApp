LifeLens - A Diary Web Application

Overview

LifeLens is an innovative diary web application designed to help users express emotions, analyze entries, and gain insights into their mental well-being. By leveraging AWS services, the platform ensures security, scalability, and a feature-rich journaling experience.

Features

🔒 Secure User Authentication: Powered by AWS Cognito.

📝 Text and Image Diary Entries: Securely store text and images using AWS DynamoDB and S3.

📊 Sentiment Analysis: Analyze diary entries with AWS Comprehend.

🎤 Voice-to-Text Conversion: Enable hands-free journaling using AWS Transcribe.

🌐 Multilingual Support: Translate diary entries with AWS Translate.

AWS Services Used

1. AWS Cognito

Purpose: Authentication and user management.

Created a Cognito User Pool for secure authentication.

Configured email as the login identifier.

Used amazon-cognito-identity-js library for backend user management.

2. AWS DynamoDB

Purpose: Store diary entries and metadata.

Designed a DiaryEntries table with entryId as the primary key (combination of email prefix and date).

Stored sentiment analysis results and random replies.

3. AWS S3

Purpose: Store images and audio files.

Configured an S3 bucket (lifelens-images) for image uploads.

Utilized multer-s3 for file handling.

Created routes for image upload and retrieval.

4. AWS Comprehend

Purpose: Sentiment analysis of diary entries.

Integrated AWS.Comprehend SDK for backend sentiment detection.

Stored sentiment results in DynamoDB.

5. AWS Transcribe

Purpose: Audio-to-text conversion.

Configured AWS.TranscribeService for transcription.

Created an S3 bucket for audio file storage (lifelens-audio).

Processed audio uploads and retrieved transcription results.

6. AWS Translate

Purpose: Multilingual support for diary entries.

Integrated AWS.Translate SDK for text translation.

Detected source language and allowed users to select target languages.

7. AWS IAM

Purpose: Access control for integrated services.

Configured an IAM user with permissions for:

S3 (read/write access).

DynamoDB (CRUD operations).

Comprehend, Translate, and Transcribe.

API Gateway.

Secured backend with IAM credentials.

8. AWS Amplify

Purpose: Host and manage the frontend.

Deployed the React app using Amplify hosting.

Configured custom domains and CORS policies for API calls.

Architecture

Overview

The architecture consists of:

Frontend: React app hosted on AWS Amplify.

Backend: API Gateway for handling requests and routing to AWS services.

Data Storage: DynamoDB for text data and S3 for multimedia storage.

Diagram



Setup and Deployment

Prerequisites

AWS account with free tier access.

Node.js and npm installed locally.

Steps

Clone the Repository:

git clone https://github.com/yourusername/lifelens.git
cd lifelens

Configure AWS CLI:

aws configure

Add your access key, secret key, and region.

Deploy Frontend:

Use AWS Amplify to deploy the React app.

Set Up Backend:

Configure DynamoDB table, S3 buckets, and Cognito User Pool.

Environment Variables:

Add your AWS credentials to .env for backend integration.

Testing

Functional Testing

Tool Used: Selenium.

Purpose: Validate the frontend workflows (e.g., sign-in, diary entry addition).

Non-Functional Testing

Tool Used: JMeter.

Purpose: Measure performance under varying loads.

Future Enhancements

Integrate AWS Rekognition for advanced emotion detection.

Add AWS Lambda for serverless backend processing.

Visualize emotional trends with data charts.

References

AWS Documentation.

Libraries: amazon-cognito-identity-js, @aws-sdk/client-s3, etc.

Community resources for AWS integration.

This project aims to combine accessibility, inclusivity, and emotional insights into a platform that promotes mental wellness and self-reflection.

