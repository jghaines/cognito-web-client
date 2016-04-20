function awsCredentialInit( OAuthAccessToken ) {
    console.log( "awsCredentialInit()" );
    // Add the Facebook access token to the Cognito credentials login map.
    AWS.config.region = 'ap-northeast-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-1:ead9e48a-e6cc-4da2-b92b-72eb6b5535e0',
        Logins: {
            'graph.facebook.com': OAuthAccessToken
        },

// Do we need these? 
// This indicates yes http://blogs.aws.amazon.com/security/post/Tx3LP54JOGBE0AY/Building-an-App-using-Amazon-Cognito-and-an-OpenID-Connect-Identity-Provider
// THis indicates no  https://mobile.awsblog.com/post/TxBVEDL5Z8JKAC/Use-Amazon-Cognito-in-your-website-for-simple-AWS-authentication
//      AccountId:  '458298098107',
//      RoleArn:    'arn:aws:iam::458298098107:role/Cognito_RapidNowAuth_Role'
    });

    // Obtain AWS credentials
    AWS.config.credentials.get( startAwsSession );
}

function startAwsSession() {
    console.log( "startAwsSession()" );

    console.log( JSON.stringify( {
        identityId      : AWS.config.credentials.identityId,
        accessKeyId     : AWS.config.credentials.accessKeyId,
        secretAccessKey : AWS.config.credentials.secretAccessKey,
        sessionToken    : AWS.config.credentials.sessionToken,
    }, null, 2));
    doCognitioData();
    doDynamoData();
//    doS3List();
}

function doCognitioData(){
    console.log( "doCognitioData()" );

    AWS.config.credentials.get(function(){
    var syncClient = new AWS.CognitoSyncManager();
    syncClient.openOrCreateDataset('myDataset', function(err, dataset) {
        dataset.put('myKey', 'myValue', function(err, record){
            dataset.synchronize({
                onSuccess: function(data, newRecords) {
                    console.log( "Sync success")
                }
            });
        });
    });
    });
}

function doDynamoData() {
    console.log( "doDynamoData()" );

    var ddb = new AWS.DynamoDB( { region : "us-west-2" } );
                 
    // Scan the table
    ddb.scan({ TableName: 'Users'}, function (err, data) {
        if (err){   // an error occurred
            console.error(err);   
        }else{      // successful response
                
            // Print the items
            var items = '';
            for (i = 0; i < data.Count; i++) {
                console.log( JSON.stringify( data.Items[i], null, 2 ));
 //               items += data.Items[i].Id.N + ' ';
            }    
//            printMessage('<span style="color:#000000">Items found:</span>'  + items);                
        }
    });
}
function doS3List() {
    console.log( "doS3List()" );

    var s3 = new AWS.S3();
    s3.listBuckets( data => console.log(JSON.stringify( data, null, 2 )));
}
