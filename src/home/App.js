import React from 'react';
import * as AWS from 'aws-sdk';

import './App.css';

export default class App extends React.Component {
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
          USERNAME: 'balint',
          PASSWORD: 'Macska88',
        },
      };
      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

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
            this.setState(state => ({ ...state, message: AWS.config.credentials.accessKeyId }));
            resolve(AWS.config.credentials.accessKeyId);
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
