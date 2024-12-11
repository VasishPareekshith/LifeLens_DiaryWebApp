# 🌟 LifeLens - A Diary Web Application

## 🖋️ Overview

LifeLens is a feature-rich diary web application that empowers users to express emotions, analyze entries, and gain insights into their mental well-being. Built on AWS services, the platform ensures robust security, seamless scalability, and an engaging journaling experience.

---

## ✨ Features

- **🔒 Secure User Authentication**: Powered by **AWS Cognito**.
- **📝 Multimedia Diary Entries**: Store text and images using **AWS DynamoDB** and **S3**.
- **📊 Sentiment Analysis**: Gain emotional insights with **AWS Comprehend**.
- **🎤 Voice-to-Text Conversion**: Journal hands-free using **AWS Transcribe**.
- **🌐 Multilingual Support**: Translate entries dynamically with **AWS Translate**.

---

## 🛠️ AWS Services Used

### **1. AWS Cognito**
- **Purpose**: Secure user authentication and management.
- **Implementation**:
  - Configured a Cognito User Pool with email as the primary identifier.
  - Integrated `amazon-cognito-identity-js` for user authentication workflows.

### **2. AWS DynamoDB**
- **Purpose**: Store text-based diary entries and metadata.
- **Implementation**:
  - Designed the `DiaryEntries` table with `entryId` as the primary key.
  - Stored sentiment results and generated personalized replies.

### **3. AWS S3**
- **Purpose**: Store images and audio files.
- **Implementation**:
  - Used the `lifelens-images` bucket for image uploads and `lifelens-audio` for audio storage.
  - Configured `multer-s3` for seamless file upload handling.

### **4. AWS Comprehend**
- **Purpose**: Sentiment analysis of diary entries.
- **Implementation**:
  - Integrated sentiment detection via `AWS.Comprehend`.
  - Stored results in DynamoDB for further analysis.

### **5. AWS Transcribe**
- **Purpose**: Convert audio to text.
- **Implementation**:
  - Enabled transcription with `AWS.TranscribeService`.
  - Managed audio storage in S3 and processed transcription results.

### **6. AWS Translate**
- **Purpose**: Enable multilingual journaling.
- **Implementation**:
  - Auto-detected source language.
  - Offered dynamic translation via `AWS.Translate` SDK.

### **7. AWS IAM**
- **Purpose**: Secure and manage service access.
- **Implementation**:
  - Configured an IAM user with specific permissions for S3, DynamoDB, Cognito, Comprehend, Transcribe, and Translate.
  - Integrated IAM roles to safeguard API Gateway.

### **8. AWS Amplify**
- **Purpose**: Host and manage the frontend.
- **Implementation**:
  - Deployed the React app with Amplify hosting.
  - Configured CORS policies for smooth API Gateway interactions.

---

## 🚀 Setup and Deployment

### 🧰 Prerequisites
- AWS Free Tier account.
- Node.js and npm installed locally.

### 🔧 Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/lifelens.git
   cd lifelens
   
2. **Configure AWS CLI**:
   ```bash
    aws configure
  Add your access key, secret key, and region.

3. **Deploy Frontend**:
  Use AWS Amplify to deploy the React app.

4. **Set Up Backend**:
  Configure DynamoDB table, S3 buckets, and Cognito User Pool.

5. **Environment Variables**:
  Add your AWS credentials to .env for backend integration.

---

**Future Enhancements**

- Integrate AWS Rekognition for advanced emotion detection.

- Add AWS Lambda for serverless backend processing.

Visualize emotional trends with data charts.

---

**References**
- AWS Documentation.
- Libraries: amazon-cognito-identity-js, @aws-sdk/client-s3, etc.
- Community resources for AWS integration.

---

This project aims to combine accessibility, inclusivity, and emotional insights into a platform that promotes mental wellness and self-reflection.
