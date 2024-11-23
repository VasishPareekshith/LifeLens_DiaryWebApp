import boto3
from botocore.exceptions import ClientError

# Configure AWS SDK to use DynamoDB in the correct region
aws_config = {
    'aws_access_key_id': '###',
    'aws_secret_access_key': '###',
    'region_name': '###'
}

# Initialize DynamoDB client
dynamo_db = boto3.resource('dynamodb', **aws_config)
table = dynamo_db.Table('DiaryEntries')

# Function to add a diary entry to DynamoDB
def addDiaryEntry(entry_id, email, entry_date, content, image_url, sentiment, random_reply ):
    item = {
        'entryId': entry_id,
        'email': email,
        'entryDate': entry_date,
        'content': content,
        'imageUrl':image_url,
        'sentiment': sentiment,
        'randomReply': random_reply
    }
    
    try:
        print(f"Adding item to DynamoDB: {item}")  # Log the item being added
        table.put_item(Item=item)
    except ClientError as error:
        raise Exception(f"Error adding item to DynamoDB: {error.response['Error']['Message']}")

# Function to get a diary entry by date and email
def getDiaryEntryByDateAndEmail(entry_date, email):
    try:
        response = table.query(
            IndexName='email-entryDate-index',  # Replace with your index name if different
            KeyConditionExpression='email = :email AND entryDate = :date',
            ExpressionAttributeValues={
                ':email': email,
                ':date': entry_date
            }
        )
        
        # Return the first item (assuming one entry per date)
        return response['Items'][0] if response['Items'] else None
    except ClientError as error:
        raise Exception(f"Error retrieving item from DynamoDB: {error.response['Error']['Message']}")

# Function to get sentiment and random reply by email and date
def getSentimentByEmailAndDate(entry_date, email):
    diary_entry = getDiaryEntryByDateAndEmail(entry_date, email)
    
    if diary_entry:
        sentiment = diary_entry.get('sentiment')
        random_reply = diary_entry.get('randomReply')
        return {'sentiment': sentiment, 'randomReply': random_reply}
    else:
        return None  # No entry found, return None

# Example usage:
# add_diary_entry('email123#2024-11-10', 'email123', '2024-11-10', 'My diary content', 'POSITIVE', 'Stay strong!')
# sentiment_data = get_sentiment_by_email_and_date('2024-11-10', 'email123')
# print(sentiment_data)
