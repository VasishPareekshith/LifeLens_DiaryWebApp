from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import uuid
import os
from werkzeug.utils import secure_filename

# Import services
from services.dynamoDB import addDiaryEntry, getDiaryEntryByDateAndEmail, getSentimentByEmailAndDate
from services.s3 import uploadToS3
from services.cognito import signUp, confirmUser, signIn
from services.comprehend import analyzeSentiment
from services.transcribe import startTranscriptionJob, getTranscriptionJob
from services.translate import translateToEnglish
app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# REPLIES
replies = {
  "POSITIVE": [
    "I'm so glad to hear you're feeling this way! Keep shining!",
    "Your positivity is contagious! What a great mindset.",
    "That's wonderful! It's amazing how a good mood can brighten your day.",
    "Great to see you happy! Keep embracing the good moments.",
    "Fantastic! Your optimism is inspiring.",
    "You deserve every bit of happiness. Enjoy it!",
    "This is a beautiful reflection of your joy.",
    "Keep spreading that positive energy!",
    "Your bright outlook is truly uplifting.",
    "Such a refreshing perspective! Keep it up!"
  ],
  "MIXED": [
    "Thank you for sharing your thoughts—every feeling has its place.",
    "Your reflections are valuable, capturing the ebb and flow of life.",
    "Life often brings a mix of experiences. Your entry reflects that well.",
    "It's okay to feel both positive and challenging emotions. They matter.",
    "Every moment, happy or tough, is a part of the journey.",
    "You're doing a great job navigating life's mix of emotions.",
    "Life has its highs and lows, and your perspective on both is meaningful.",
    "Each reflection you share is a step toward greater understanding.",
    "Your entry captures life's many shades. Thanks for sharing.",
    "Reflecting on both sides shows a balanced approach to life's moments."
  ],
  "NEUTRAL": [
    "It's interesting to hear your thoughts.",
    "Thank you for sharing. Life has its ups and downs.",
    "Your reflections are valued. Every moment has its place.",
    "It's okay to feel this way. Life can be quite a mix.",
    "Thanks for sharing your entry. It matters.",
    "This entry offers a calm perspective on life.",
    "Life often presents us with various shades.",
    "Your neutrality reflects a balanced mindset.",
    "Every thought you share is a step forward.",
    "Your entries capture the essence of life's ebb and flow."
  ],
  "NEGATIVE": [
    "I'm sorry to hear you're feeling this way. It's okay to seek support.",
    "That sounds tough. Acknowledging your feelings is important.",
    "I understand that this can be challenging. You're not alone in this.",
    "It's okay to express what you're going through.",
    "Remember, tough times don't last, but tough people do.",
    "It's important to take care of yourself during hard times.",
    "Every emotion is valid. You're not alone in feeling this way.",
    "Your feelings are important and deserve to be heard.",
    "It's okay to feel down sometimes. Take it one day at a time.",
    "You are stronger than you think, and brighter days are ahead."
  ]
}
# AUTHENTICATION ROUTES
@app.route('/api/auth/sign-up', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    try:
        result = signUp(email, password, name)
        return jsonify({"message": 'User signed up successfully', "user": result['user']}), 201
    except Exception as err:
        return jsonify({"error": str(err)}), 500

@app.route('/api/auth/confirm', methods=['POST'])
def confirm():
    data = request.json
    email = data.get('email')
    confirmation_code = data.get('confirmationCode')
    try:
        result = confirmUser(email, confirmation_code)
        return jsonify({"message": 'User confirmed successfully!'}), 200
    except Exception as err:
        return jsonify({"error": str(err)}), 500

@app.route('/api/auth/sign-in', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    try:
        result = signIn(email, password)

        # Check if there was an error in the sign-in function response
        if 'error' in result:
            return jsonify({"error": result['error']}), 500

        # Return token directly
        return jsonify({"message": 'Sign-in successful', "token": result['idToken']}), 200
    except Exception as err:
        return jsonify({"error": str(err)}), 500


# DIARY ENTRY ROUTES
@app.route('/api/diary/add-entry', methods=['POST'])
def add_entry():
    data = request.json
    email = data.get('email')
    entry_date = data.get('entryDate')
    content = data.get('content')
    image_url = data.get('imageUrl')
    
    try:
        sentiment = analyzeSentiment(content)
        safe_email_part = email.split('@')[0]
        entry_id = f"{safe_email_part}-{entry_date}"
        random_reply = random.choice(replies[sentiment])
        
        addDiaryEntry(entry_id, email, entry_date, content, image_url, sentiment, random_reply)
        
        return jsonify({"message": 'Diary entry added successfully!', "sentiment": sentiment}), 200
    except Exception as err:
        return jsonify({"error": 'Failed to add diary entry', "details": str(err)}), 500

@app.route('/api/diary/get-entry', methods=['GET'])
def get_entry():
    entry_date = request.args.get('entryDate')
    email = request.args.get('email')
    if not entry_date or not email:
        return jsonify({"error": 'Missing date or email parameter'}), 400
    
    try:
        diary_entry = getDiaryEntryByDateAndEmail(entry_date, email)
        if not diary_entry:
            return jsonify({"message": 'No entry found for this date and email'}), 404
        
        return jsonify(diary_entry), 200
    except Exception as error:
        return jsonify({"error": 'Error fetching diary entry'}), 500

@app.route('/api/diary/get-sentiment-by-email-and-date', methods=['GET'])
def get_sentiment_by_email_and_date():
    entry_date = request.args.get('entryDate')
    email = request.args.get('email')

    if not entry_date or not email:
        return jsonify({"error": 'Missing entryDate or email parameter'}), 400

    try:
        result = getSentimentByEmailAndDate(entry_date, email)
        sentiment = result.get('sentiment')
        random_reply = result.get('randomReply')
        if sentiment is None:
            return jsonify({"message": 'No sentiment found for this entry'}), 404
        return jsonify({"sentiment": sentiment, "randomReply": random_reply}), 200
    except Exception as error:
        return jsonify({"error": 'Could not retrieve sentiment'}), 500

# AUDIO TRANSCRIPTION ROUTES
@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({"error": 'No audio file part'}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({"error": 'No selected file'}), 400

    try:
        # Read the file content and upload directly to S3
        file_name = secure_filename(audio_file.filename)
        file_content = audio_file.read()  # Get file content
        audio_url = uploadToS3(file_content, file_name)  # Direct upload to S3
        
        job_name = f"transcription-job-{uuid.uuid4()}"
        
        # Start the transcription job using the uploaded S3 file URL
        startTranscriptionJob(job_name, audio_url)
        return jsonify({"jobName": job_name}), 200
    except Exception as error:
        return jsonify({"error": 'Error processing the audio file'}), 500


@app.route('/transcription-status/<job_name>', methods=['GET'])
def transcription_status(job_name):
    try:
        job_data = getTranscriptionJob(job_name)
        return jsonify(job_data), 200
    except Exception as error:
        return jsonify({"error": 'Error fetching transcription job status'}), 500

# TRANSLATION ROUTE
@app.route('/api/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text')
    
    try:
        translated_text = translateToEnglish(text)
        return jsonify({"translatedText": translated_text}), 200
    except Exception as error:
        return jsonify({"error": 'Translation failed'}), 500

# IMAGE UPLOAD ROUTE
@app.route('/api/diary/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": 'No image file part'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": 'No selected file'}), 400

    try:
        # Read the file content and upload directly to S3
        file_name = secure_filename(image_file.filename)
        file_content = image_file.read()  # Get file content
        image_url = uploadToS3(file_content, file_name)  # Direct upload to S3
        return jsonify({"imageUrl": image_url}), 200
    except Exception as error:
        return jsonify({"error": f'File upload error: {error}'}), 500

# RUN THE SERVER
if __name__ == '__main__':
    app.run(debug=True, port=int(os.getenv('PORT', 5000)))
