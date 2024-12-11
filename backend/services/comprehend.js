const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const comprehend = new AWS.Comprehend();

const analyzeSentiment = async (text) => {
  const params = {
    TextList: [text],
    LanguageCode: 'en', // Specify the language code; change if needed
  };

  try {
    const data = await comprehend.batchDetectSentiment(params).promise();
    const sentimentData = data.ResultList[0];
    console.log(sentimentData);
    const sentiment = sentimentData.Sentiment;
    return sentiment; 
  } catch (error) {
    throw new Error(`Comprehend Error: ${error.message}`);
  }
};

module.exports = { analyzeSentiment };
