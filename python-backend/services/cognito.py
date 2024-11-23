import boto3
from botocore.exceptions import NoCredentialsError, ClientError

# Configuration for Cognito User Pool and Identity Pool
USER_POOL_ID = '###'  # Replace with your User Pool ID
CLIENT_ID = '###'  # Replace with your App Client ID
IDENTITY_POOL_ID = '###'  # Replace with your Identity Pool ID

# Initialize Cognito clients
cognito_client = boto3.client('cognito-idp', region_name='ap-southeast-2')
cognito_identity_client = boto3.client('cognito-identity', region_name='ap-southeast-2')

# Function to sign up a user
def signUp(email, password, name):
    try:
        response = cognito_client.sign_up(
            ClientId=CLIENT_ID,
            Username=email,
            Password=password,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'name', 'Value': name}
            ]
        )
        return response
    except cognito_client.exceptions.UsernameExistsException:
        return {'error': 'User already exists'}
    except ClientError as e:
        return {'error': str(e)}

# Function to confirm user registration
def confirmUser(email, confirmation_code):
    try:
        response = cognito_client.confirm_sign_up(
            ClientId=CLIENT_ID,
            Username=email,
            ConfirmationCode=confirmation_code
        )
        return response
    except ClientError as e:
        return {'error': str(e)}

# Function to sign in a user and get temporary credentials
# Function to sign in a user and get temporary credentials
def signIn(email, password):
    try:
        auth_response = cognito_client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            ClientId=CLIENT_ID,
            AuthParameters={
                'USERNAME': email,
                'PASSWORD': password
            }
        )

        # Extract IdToken from the response
        id_token = auth_response['AuthenticationResult'].get('IdToken')
        
        # Ensure id_token is returned correctly in the response
        return {'idToken': id_token}

    except Exception as e:
        return {'error': str(e)}

