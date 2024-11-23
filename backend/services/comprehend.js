const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId:'###',
  secretAccessKey:'###',
  region: '###'
});
// Configure AWS Comprehend
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
    return sentiment; // Returns the sentiment analysis results
  } catch (error) {
    throw new Error(`Comprehend Error: ${error.message}`);
  }
};

module.exports = { analyzeSentiment };
