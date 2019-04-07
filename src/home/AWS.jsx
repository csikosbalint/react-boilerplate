import React from 'react';
import AWS from 'aws-sdk/global';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import STS from 'aws-sdk/clients/sts';
import './App.css';

export default class App extends React.Component {
  username = 'balint';

  region = 'us-east-1';

  identityPool = 'us-east-1:68c84c7d-8a96-4772-bcf2-caab494862c6';

  poolId = 'us-east-1_ire4UV03B';

  appDomain = 'quicksight-users.auth.us-east-1.amazoncognito.com';

  clientId = '6tbqooofo0s15rgk5i4v5s630m';

  redirectUrl = 'https://bulkdownload.sandbox-bud.net';

  constructor() {
    super();
    this.state = {
      message: 'Doing auth, please wait!',
    };

    // Use AWS tools without authentication
    AWS.config.update({
      region: this.region,
      accessKeyId: 'null',
      secretAccessKey: 'null',
    });
  }

  async componentDidMount() {
    return new Promise((resolve, reject) => {
      // Authenticate user and retireve tokens
      const params = {
        AuthFlow: 'USER_PASSWORD_AUTH', /* required */
        ClientId: this.clientId, /* required */
        AuthParameters: {
          USERNAME: this.username,
          PASSWORD: 'Macska88',
        },
      };
      const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();

      cognitoidentityserviceprovider.initiateAuth(params, (err, data) => {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        } else {
          console.log(JSON.stringify(data.AuthenticationResult));
          const idToken = data.AuthenticationResult.IdToken;
          const cognitoParams = {
            IdentityPoolId: this.identityPool,
            Logins: {},
          };
          cognitoParams
            .Logins[`cognito-idp.${this.region}.amazonaws.com/${this.poolId}`] = idToken;

          AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
          AWS.config.getCredentials(() => {
            console.log(AWS.config.credentials);
            this.setState(state => ({ ...state, message: AWS.config.credentials.accessKeyId }));

            const sts = new STS();

            const pa = {
              RoleArn: 'arn:aws:iam::327953370525:role/Clinician',
              RoleSessionName: this.username,
            };
            sts.assumeRole(pa, (er, da) => {
              if (er) {
                console.log(er, er.stack); // an error occurred
              } else {
                console.log(da); // successful response
                AWS.config.credentials = new AWS.Credentials({
                  accessKeyId: da.Credentials.AccessKeyId,
                  secretAccessKey: da.Credentials.SecretAccessKey,
                  sessionToken: da.Credentials.SessionToken,
                });
                this.setState(state => ({ ...state, message: AWS.config.credentials.accessKeyId }));

                resolve(AWS.config.credentials.accessKeyId);

                /*
                 data = {
                  AssumedRoleUser: {
                   Arn: "arn:aws:sts::123456789012:assumed-role/demo/Bob",
                   AssumedRoleId: "ARO123EXAMPLE123:Bob"
                  },
                  Credentials: {
                   AccessKeyId: "AKIAIOSFODNN7EXAMPLE",
                   Expiration: <Date Representation>,
                   SecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY",
                   SessionToken: ""
                  },
                  PackedPolicySize: 6
                 }
                 */
              }
            });
          });
        }
      });
    });
  }

  render() {
    return <div>
      <h1>{this.state.message}</h1>
    </div>;
  }
}
