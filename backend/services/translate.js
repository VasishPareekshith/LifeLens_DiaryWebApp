const { TranslateClient, TranslateTextCommand } = require("@aws-sdk/client-translate");

const client = new TranslateClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const translateToEnglish = async (text) => {
  const command = new TranslateTextCommand({
    Text: text,
    SourceLanguageCode: "auto", 
    TargetLanguageCode: "en",  
  });

  const response = await client.send(command);
  return response.TranslatedText;
};

module.exports = translateToEnglish;
