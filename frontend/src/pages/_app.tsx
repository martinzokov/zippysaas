import '../styles/global.css';
import Amplify, { Auth, Hub } from 'aws-amplify';
import type { AppProps } from 'next/app';

const HOSTED_URL = 'https://vn0q5aj1w0.execute-api.eu-west-1.amazonaws.com/dev/';

const config = {
  HOSTED_URL,
  MODE: 'DEVELOPMENT',
  REGION: 'eu-west-1',
  REDIRECT_SIGN_IN: `http://localhost:3000/`,
  REDIRECT_SIGN_OUT: `http://localhost:3000/signout`,
  AUTHENTICATION_TYPE: 'AWS_IAM' as const,

  /**
   * Add the details from the Pulumi output here, after running 'pulumi up'
   */
  USER_POOL_CLIENT_ID: '7e3jli05poglpv66o5heqpkr5o',
  USER_POOL_ID: 'eu-west-1_Ov7l0ZwqL',
  IDENTITY_POOL_ID: 'eu-west-1:45fb7418-8990-41ab-8148-7380c107affb',
};

const awsconfig = {
  Auth: {
    mandatorySignIn: true,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    identityPoolId: config.IDENTITY_POOL_ID,
    userPoolWebClientId: config.USER_POOL_CLIENT_ID,
    oauth: {
      domain: 'dev-zippysaas-v2-auth.auth.eu-west-1.amazoncognito.com',
      redirectSignIn: config.REDIRECT_SIGN_IN,
      redirectSignOut: config.REDIRECT_SIGN_OUT,
      scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
      responseType: 'code',
    },
  },
  federationTarget: 'COGNITO_USER_POOLS',
};


Amplify.configure(awsconfig);

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default MyApp;
