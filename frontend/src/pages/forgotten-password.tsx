import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import Amplify, { Auth, Hub } from "aws-amplify";
import { useState } from "react";
import { useRouter } from "next/router";

const ForgottenPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgottenPassword = async (e) => {
    await Auth.forgotPassword(email)
      .then((data) => {
        router.push("/reset-password?email=" + email);
      })
      .catch((err) => console.log(err));
  };
  return (
    //<Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgotten password
          </h2>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleForgottenPassword}
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Send code
            </button>
          </div>
        </form>
      </div>
    </div>
    //</Main>)
  );
};

export default ForgottenPassword;
