const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const { addDiaryEntry, getDiaryEntryByDateAndEmail ,getSentimentByEmailAndDate} = require('./services/dynamoDB');
const { upload, getImageFromS3, GetObjectCommand } = require('./services/s3');
const { signUp, confirmUser, signIn } = require('./services/cognito');
const { analyzeSentiment } = require('./services/comprehend'); 
const { uploadToS3, startTranscriptionJob, getTranscriptionJob } = require('./services/transcribe');
const translateToEnglish = require("./services/translate");

const PORT = process.env.PORT || 5000;

const storage = multer.memoryStorage(); // Use memory storage for direct buffer access
const uploadaudio = multer({ storage }); // Set the storage option
app.use(cors({ origin: 'https://dev.d2akm26rklrlue.amplifyapp.com' }));
app.options('*', cors());
app.use(express.json()); // Middleware to parse JSON request bodiess

// === REPLIES ===
const replies = {
  POSITIVE: [
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
  MIXED: [
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
  NEUTRAL: [
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
  NEGATIVE: [
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
};



// === AUTHENTICATION ROUTES ===
app.post('/api/auth/sign-up', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const result = await signUp(email, password, name);
    res.status(201).json({ message: 'User signed up successfully', user: result.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/confirm', async (req, res) => {
  const { email, confirmationCode } = req.body;
  try {
    const result = await confirmUser(email, confirmationCode);
    res.status(200).json({ message: 'User confirmed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/sign-in', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await signIn(email, password);
    const token = result.getIdToken().getJwtToken();
    res.status(200).json({ message: 'Sign-in successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === DIARY ENTRY ROUTES ===
app.post('/api/diary/add-entry', async (req, res) => {
  const { email, entryDate, content, imageUrl } = req.body;
  try {
    // Analyze sentiment
    const sentiment = await analyzeSentiment(content);
    const safeEmailPart = email.split('@')[0];
    const entryId = `${safeEmailPart}-${entryDate}`;
    // Select a random reply based on sentiment
    const randomReply = replies[sentiment][Math.floor(Math.random() * 10)];

    // Add the diary entry
    await addDiaryEntry(entryId, email, entryDate, content, imageUrl, sentiment, randomReply);

    res.status(200).json({ message: 'Diary entry added successfully!', sentiment });
    console.log(sentiment);
  } catch (err) {
    console.error('Error adding diary entry:', err);
    res.status(500).json({ error: 'Failed to add diary entry', details: err });
  }
});

app.get('/api/diary/get-entry', async (req, res) => {
  const { entryDate, email } = req.query;  // Get date and email from query parameters
  if (!entryDate || !email) {
      return res.status(400).json({ error: 'Missing date or email parameter' });
  }

  try {
      const diaryEntry = await getDiaryEntryByDateAndEmail(entryDate, email);  // Implement this function
      
      if (!diaryEntry) {
          return res.status(404).json({ message: 'No entry found for this date and email' });
      }

      res.status(200).json(diaryEntry);  // Send back the entry data
  } catch (error) {
      console.error('Error fetching diary entry:', error);
      res.status(500).json({ error: 'Error fetching diary entry' });
  }
});

// API to get sentiment and random reply based on email and entry date
app.get('/api/diary/get-sentiment-by-email-and-date', async (req, res) => {
  const { entryDate, email } = req.query;

  // Validate query parameters
  if (!entryDate || !email) {
    return res.status(400).json({ error: 'Missing entryDate or email parameter' });
  }

  try {
    // Call the sentiment function which now returns both sentiment and randomReply
    const { sentiment, randomReply } = await getSentimentByEmailAndDate(entryDate, email);  

    if (sentiment === null) {
      return res.status(404).json({ message: 'No sentiment found for this entry' });
    }

    // Return both sentiment and randomReply
    res.status(200).json({ sentiment, randomReply });  
  } catch (error) {
    console.error('Error fetching sentiment:', error);
    res.status(500).json({ error: 'Could not retrieve sentiment' });
  }
});

// audio transcribe
app.post('/upload', uploadaudio.single('audio'), async (req, res) => {
  try {
      const audioFileBuffer = req.file.buffer; 
      const fileName = req.file.originalname; 
      const audioUrl = await uploadToS3(audioFileBuffer, fileName);

      const jobName = `transcription-job-${Date.now()}`; 
      await startTranscriptionJob(jobName, audioUrl); 
      res.status(200).json({ jobName });
  } catch (error) {
      console.error('Error processing the audio file:', error);
      res.status(500).json({ error: 'Error processing the audio file' });
  }
});


app.get('/transcription-status/:jobName', async (req, res) => {
  const jobName = req.params.jobName; // Ensure this is the correct job name

  try {
      if (typeof jobName !== 'string') {
          throw new Error('TranscriptionJobName must be a string');
      }

      const jobData = await getTranscriptionJob(jobName);
      res.status(200).json(jobData);
  } catch (error) {
      console.error('Error fetching transcription job status:', error);
      res.status(500).json({ error: 'Error fetching transcription job status' });
  }
});

// Route for translation
app.post("/api/translate", async (req, res) => {
  const { text } = req.body;

  try {
    const translatedText = await translateToEnglish(text);
    res.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

// === IMAGE UPLOAD ROUTE ===
app.post('/api/diary/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the URL of the uploaded image from S3
    res.status(200).json({ imageUrl: req.file.location });
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ error: 'File upload error: ' + error.message });
  }
});

app.get('/image/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { contentType, bodyStream } = await getImageFromS3(`assets/${key}`);

    // Set the content type for the response
    res.setHeader('Content-Type', contentType);

    // Pipe the image stream to the response
    bodyStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving image from S3' });
  }
});

// Route to get the image directly from S3
app.get('/image-url/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const command = new GetObjectCommand({
      Bucket: 'lifelens-images',  // Replace with your S3 bucket name
      Key: `images/${key}`, // Path to the image in your S3 bucket
    });

    const { Body, ContentType } = await s3.send(command);

    res.setHeader('Content-Type', ContentType);
    Body.pipe(res);  // Stream the image to the client
  } catch (error) {
    console.error('Error getting image from S3:', error);
    res.status(500).json({ error: 'Error retrieving image from S3' });
  }
});


// === PROXY ROUTE TO FORWARD REQUESTS TO ADGARD.NET ===
app.get('/proxy/adgard', async (req, res) => {
  try {
    const response = await axios.get('https://adgard.net/code?id=bjyERE3DxNAm&type=1');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from adgard.net:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Serve the React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
