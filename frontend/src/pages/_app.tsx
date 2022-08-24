import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../styles/global.css";
import Amplify, { Auth, Hub } from "aws-amplify";
import type { AppProps } from "next/app";

const HOSTED_URL =
  "https://ldf0f54op8.execute-api.eu-west-1.amazonaws.com/dev/";

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
  USER_POOL_CLIENT_ID: "11h6r8ppfiakrab9q2m6sq5m5l",
  USER_POOL_ID: "eu-west-1_JcIFsruDy",
  IDENTITY_POOL_ID: "eu-west-1:a6a4ed17-54fe-4ba1-9fe1-100ae984d555",
};

const awsconfig = {
  Auth: {
    mandatorySignIn: true,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    identityPoolId: config.IDENTITY_POOL_ID,
    userPoolWebClientId: config.USER_POOL_CLIENT_ID,
    oauth: {
      domain: "dev-zippysaas.auth.eu-west-1.amazoncognito.com",
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
