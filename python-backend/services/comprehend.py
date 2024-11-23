import boto3
from botocore.exceptions import ClientError

# Configure AWS SDK
aws_config = {
    'aws_access_key_id': '###',
    'aws_secret_access_key': '###',
    'region_name': '###'
}

# Initialize the AWS Comprehend client
comprehend_client = boto3.client('comprehend', **aws_config)

# Function to analyze sentiment using AWS Comprehend
def analyzeSentiment(text):
    params = {
        'TextList': [text],
        'LanguageCode': 'en'  # Specify the language code; change if needed
    }

    try:
        response = comprehend_client.batch_detect_sentiment(**params)
        sentiment_data = response['ResultList'][0]
        sentiment = sentiment_data['Sentiment']
        return sentiment  # Returns the sentiment analysis results
    except ClientError as error:
        raise Exception(f"Comprehend Error: {error.response['Error']['Message']}")

# Example usage:
# sentiment = analyze_sentiment("I am happy today!")
# print(sentiment)
