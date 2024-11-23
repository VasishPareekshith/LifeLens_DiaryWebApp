import boto3
from botocore.exceptions import ClientError

# AWS Translate Client Configuration
aws_access_key_id = '###'
aws_secret_access_key = '###'
region_name = '###'

# Initialize Translate Client
translate_client = boto3.client('translate', 
                                aws_access_key_id=aws_access_key_id, 
                                aws_secret_access_key=aws_secret_access_key, 
                                region_name=region_name)

# Function to perform translation to English
def translateToEnglish(text):
    try:
        response = translate_client.translate_text(
            Text=text,
            SourceLanguageCode='auto',  # Auto-detect the language
            TargetLanguageCode='en'     # Translate to English
        )
        return response['TranslatedText']
    except ClientError as e:
        print(f"Error translating text: {e}")
        raise e

# Example usage
if __name__ == "__main__":
    input_text = "Hola, ¿cómo estás?"
    translated_text = translateToEnglish(input_text)
    print("Translated Text:", translated_text)
