const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addDiaryEntry = async (entryId, email, entryDate, content, imageUrl = null, sentiment, randomReply) => {
  const params = {
    TableName: 'DiaryEntries',
    Item: {
      entryId,
      email,
      entryDate,
      content,
      imageUrl,
      sentiment,
      randomReply
    },
  };

  console.log('Adding item to DynamoDB:', params.Item); 
  return dynamoDb.put(params).promise();
};

const getDiaryEntryByDateAndEmail = async (entryDate, email) => {
    const params = {
        TableName: 'DiaryEntries',
        IndexName: 'email-entryDate-index',  // Replace with your index name if different
        KeyConditionExpression: 'email = :email AND entryDate = :date',  
        ExpressionAttributeValues: {
            ':email': email,
            ':date': entryDate
        }
    };
    const result = await dynamoDb.query(params).promise();
    return result.Items[0];  
};

const getSentimentByEmailAndDate = async (entryDate, email) => {
  const diaryEntry = await getDiaryEntryByDateAndEmail(entryDate, email);
  
  if (diaryEntry) {
      const { sentiment, randomReply } = diaryEntry; 
      
      return { sentiment, randomReply };
  } else {
      return null; 
  }
};

module.exports = { addDiaryEntry, getDiaryEntryByDateAndEmail, getSentimentByEmailAndDate };
