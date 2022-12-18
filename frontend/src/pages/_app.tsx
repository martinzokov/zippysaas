import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/global.css";
import Amplify, { Auth } from "aws-amplify";
import type { AppProps } from "next/app";
import { getApiHost } from "@/client/environmentConfig";

const HOSTED_URL = getApiHost();

console.log("api host: " + HOSTED_URL);

const config = {
  HOSTED_URL,
  REGION: process.env.NEXT_PUBLIC_AWS_REGION!,
  AUTHENTICATION_TYPE: "AWS_IAM" as const,
  // TODO Configure URLs
  REDIRECT_SIGN_IN: `http://localhost:3000/`,
  REDIRECT_SIGN_OUT: `http://localhost:3000/signout`,

  // TODO Configure Cognito IDs in .env files
  USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
  USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID!,
  IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID!,
};

const awsconfig = {
  Auth: {
    mandatorySignIn: true,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    identityPoolId: config.IDENTITY_POOL_ID,
    userPoolWebClientId: config.USER_POOL_CLIENT_ID,
    oauth: {
      domain: process.env.NEXT_PUBLIC_OAUTH_COGNITO_HOST!,
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
