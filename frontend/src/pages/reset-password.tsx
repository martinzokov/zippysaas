import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import Amplify, { Auth, Hub } from "aws-amplify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface PasswordValidation {
  hasUpperAndLower: Boolean;
  hasNumber: Boolean;
  hasSpecial: Boolean;
  hasLength: Boolean;
}

const ForgottenPassword = () => {
  const router = useRouter();
  const { email } = router.query;
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [validation, setValidation] = useState<PasswordValidation>({
    hasUpperAndLower: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
  });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (isValid()) {
      try {
        await Auth.forgotPasswordSubmit(email, code, password);
        router.push("/signin");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  useEffect(() => {
    isValidLength(password);
    hasUpperAndLowerCaseLetter(password);
    hasNumber(password);
    hasSpecialCharacter(password);
  }, [password]);

  const isValidLength = (password: string) => {
    let hasLength = password.length >= 8;
    setValidation((validation) => ({ ...validation, hasLength: hasLength }));
    return hasLength;
  };

  const hasUpperAndLowerCaseLetter = (password: string) => {
    let hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
    setValidation((validation) => ({
      ...validation,
      hasUpperAndLower: hasUpperAndLower,
    }));
    return hasUpperAndLower;
  };

  const hasNumber = (password: string) => {
    let hasNumber = /\d/.test(password);
    setValidation((validation) => ({ ...validation, hasNumber: hasNumber }));
    return hasNumber;
  };

  const hasSpecialCharacter = (password: string) => {
    let hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    setValidation((validation) => ({ ...validation, hasSpecial: hasSpecial }));
    return hasSpecial;
  };

  const isValid = () => {
    return (
      validation.hasLength &&
      validation.hasUpperAndLower &&
      validation.hasNumber &&
      validation.hasSpecial
    );
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

        <form
          onSubmit={handleResetPassword}
          className="mt-8 space-y-6"
          action="#"
          method="POST"
        >
          <div className="">
            <label htmlFor="" className="text-sm font-medium text-gray-900">
              Code
            </label>
            <input
              type="text"
              name="reset-code"
              id="reset-code"
              required
              onChange={handleCodeChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-900"
            >
              New password
            </label>
            <input
              type="password"
              name="new-password"
              id="new-password"
              autoComplete="new-password"
              required
              onChange={handlePasswordChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="mx-5 my-3">
            <div className="text-sm flex flex-col w-48 rounded-md p-3">
              <span className={validation.hasLength ? "hidden" : ""}>
                At least 8 characters
              </span>
              <span className={validation.hasUpperAndLower ? "hidden" : ""}>
                Upper and lower case
              </span>
              <span className={validation.hasNumber ? "hidden" : ""}>
                A number
              </span>
              <span className={validation.hasSpecial ? "hidden" : ""}>
                Needs a special character
              </span>
            </div>
          </div>
          <div>
            <button
              onClick={handleResetPassword}
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
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
    //</Main>)
  );
};

export default ForgottenPassword;
