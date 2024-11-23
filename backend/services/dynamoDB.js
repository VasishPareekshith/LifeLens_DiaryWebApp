const AWS = require('aws-sdk');

// Configure AWS SDK to use DynamoDB in the correct region
AWS.config.update({
  accessKeyId:'###',
  secretAccessKey:'###',
  region: '###'
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Function to add a diary entry to DynamoDB
const addDiaryEntry = async (entryId, email, entryDate, content, imageUrl = null, sentiment, randomReply) => {
  const params = {
    TableName: 'DiaryEntries',
    Item: {
      entryId,
      email, // Use email as an attribute
      entryDate,
      content,
      imageUrl, // Store image URL if present
      sentiment,
      randomReply
    },
  };

  console.log('Adding item to DynamoDB:', params.Item); // Log the item being added
  return dynamoDb.put(params).promise();
};

const getDiaryEntryByDateAndEmail = async (entryDate, email) => {
    const params = {
        TableName: 'DiaryEntries',
        IndexName: 'email-entryDate-index',  // Replace with your index name if different
        KeyConditionExpression: 'email = :email AND entryDate = :date',  // Adjust based on schema
        ExpressionAttributeValues: {
            ':email': email,
            ':date': entryDate
        }
    };
    const result = await dynamoDb.query(params).promise();
    return result.Items[0];  // Return the first item (assuming one entry per date)
};

const getSentimentByEmailAndDate = async (entryDate, email) => {
  const diaryEntry = await getDiaryEntryByDateAndEmail(entryDate, email);
  
  if (diaryEntry) {
      // Assuming diaryEntry has both 'sentiment' and 'randomReply' fields
      const { sentiment, randomReply } = diaryEntry; // Destructure sentiment and randomReply
      
      return { sentiment, randomReply }; // Return both sentiment and random reply
  } else {
      return null; // No entry found, return null
  }
};


module.exports = { addDiaryEntry, getDiaryEntryByDateAndEmail, getSentimentByEmailAndDate };
