const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID, //User Pool ID
  ClientId: process.env.COGNITO_CLIENT_ID,  //App Client ID
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const signUp = (email, password, name) => {
  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'name',
      Value: name,
    }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const confirmUser = (email, confirmationCode) => {
  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

const signIn = (email, password) => {
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // On successful sign-in, get temporary credentials
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID, //Identity Pool ID
          Logins: {
            [`cognito-idp.ap-southeast-2.amazonaws.com/${poolData.UserPoolId}`]: result.getIdToken().getJwtToken(),
          },
        });

        AWS.config.credentials.get((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

module.exports = { signUp, confirmUser, signIn};
