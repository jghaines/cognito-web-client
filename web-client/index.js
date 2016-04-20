function awsCredentialInit( OAuthAccessToken ) {
    // Add the Facebook access token to the Cognito credentials login map.
    AWS.config.region = 'ap-northeast-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-1:ead9e48a-e6cc-4da2-b92b-72eb6b5535e0',
        Logins: {
            'graph.facebook.com': OAuthAccessToken
        }
    });

    // Obtain AWS credentials
    AWS.config.credentials.get(function(){
        // Access AWS resources here.
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
    });
}



function onLogin(response) {

  // Check if the user logged in successfully.
  if (response.authResponse) {
    console.log('You are now logged in.');
    awsCredentialInit( response.authResponse.accessToken );
  } else {
    console.log('There was a problem logging you in.');
  }

}
