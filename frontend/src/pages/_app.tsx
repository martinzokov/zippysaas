import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../styles/global.css";
import Amplify, { Auth, Hub } from "aws-amplify";
import type { AppProps } from "next/app";

const HOSTED_URL =
  "https://46ll6x3x9i.execute-api.eu-west-1.amazonaws.com/dev/";

const config = {
  HOSTED_URL,
  MODE: "DEVELOPMENT",
  REGION: "eu-west-1",
  REDIRECT_SIGN_IN: `http://localhost:3000/`,
  REDIRECT_SIGN_OUT: `http://localhost:3000/signout`,
  AUTHENTICATION_TYPE: "AWS_IAM" as const,

  /**
   * Add the details from the Pulumi output here, after running 'pulumi up'
   */
  USER_POOL_CLIENT_ID: "21hd3lellvhntt8jafeisu86f4",
  USER_POOL_ID: "eu-west-1_Ix2mFv0Vz",
  IDENTITY_POOL_ID: "eu-west-1:39005e1d-d314-4474-9527-1cd973d0caae",
};

const awsconfig = {
  Auth: {
    mandatorySignIn: true,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    identityPoolId: config.IDENTITY_POOL_ID,
    userPoolWebClientId: config.USER_POOL_CLIENT_ID,
    oauth: {
      domain: "dev-zippysaas-v2.auth.eu-west-1.amazoncognito.com",
      redirectSignIn: config.REDIRECT_SIGN_IN,
      redirectSignOut: config.REDIRECT_SIGN_OUT,
      scope: ["email", "openid", "aws.cognito.signin.user.admin"],
      responseType: "code",
    },
  },
  federationTarget: "COGNITO_USER_POOLS",
};

Amplify.configure(awsconfig);

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    Auth.currentSession().catch((err) => {
      router.push("/signin");
    });
  }, []);
  return <Component {...pageProps} />;
};

export default MyApp;
