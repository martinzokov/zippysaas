import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import Amplify, { Auth, Hub } from "aws-amplify";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import googleLogo from "../../public/assets/images/g-signin.svg";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleSignin = async () => {
    let result = await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
    console.log(result);
  };
  const emailSignin = async () => {
    try {
      await Auth.signIn(email, password);
      router.push("/");
    } catch (error) {
      console.log("error signing in", error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 h-screen">
      <div className="max-w-lg w-full space-y-8 bg-white rounded-lg shadow-xl p-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <div className="text-md flex justify-center mt-10">
            <span>No account yet?</span>
            <Link href="/signup">
              <a className="font-small text-sm underline text-neutral-600 hover:text-indigo-500 ml-1">
                {" "}
                Sign Up{" "}
              </a>
            </Link>
          </div>
        </div>
        <div>
          <button
            onClick={googleSignin}
            aria-label="Continue with google"
            role="button"
            className="py-2 px-4 border rounded-lg border-gray-400 hover:border-gray-500 flex items-center w-full mt-10"
          >
            <img src={googleLogo.src} alt="google" />
            <p className="text-base font-medium ml-4 text-gray-700">
              Continue with Google
            </p>
          </button>
        </div>

        <div className="relative flex my-1 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                onChange={handleEmailChange}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-main focus:border-main focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                onChange={handlePasswordChange}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-main focus:border-main focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              onClick={emailSignin}
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-main hover:bg-main-dark focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
          <div className="flex text-center items-center">
            <Link href="/forgotten-password">
              <a className="font-small text-sm underline text-neutral-600 hover:text-indigo-500">
                {" "}
                Forgot your password?{" "}
              </a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
