const { TranslateClient, TranslateTextCommand } = require("@aws-sdk/client-translate");

// Configure AWS Translate client
const client = new TranslateClient({
  region: '###',
  credentials: {
    accessKeyId: '###',
    secretAccessKey: '###',
  },
});

// Function to perform translation
const translateToEnglish = async (text) => {
  const command = new TranslateTextCommand({
    Text: text,
    SourceLanguageCode: "auto",  // Auto-detect the language
    TargetLanguageCode: "en",    // Translate to English
  });

  const response = await client.send(command);
  return response.TranslatedText;
};

module.exports = translateToEnglish;
