import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import { Dialog } from "@headlessui/react";

interface PasswordValidation {
  hasUpperAndLower: Boolean;
  hasNumber: Boolean;
  hasSpecial: Boolean;
  hasLength: Boolean;
  passwordsMatch: Boolean;
}

const Settings = () => {
  let [settingsUpdatedOpen, setSettingsUpdatedOpen] = useState(false);

  useEffect(() => {
    Auth.currentUserPoolUser()
      .then((user) => {
        Auth.userAttributes(user)
          .then((attributes) => {
            console.log(
              attributes.filter(
                (attribute) => attribute.Name === "identities"
              )[0]?.Value
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validation, setValidation] = useState<PasswordValidation>({
    hasUpperAndLower: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
    passwordsMatch: false,
  });

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setnewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (isValid()) {
      await Auth.currentAuthenticatedUser()
        .then((user) => {
          return Auth.changePassword(user, oldPassword, newPassword);
        })
        .then((data) => {
          setSettingsUpdatedOpen(true);
          setInterval(() => {
            setSettingsUpdatedOpen(false);
          }, 3000);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    isValidLength(newPassword);
    hasUpperAndLowerCaseLetter(newPassword);
    hasNumber(newPassword);
    hasSpecialCharacter(newPassword);
    isValidConfirmPassword(newPassword, confirmPassword);
  }, [newPassword, confirmPassword]);

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

  const isValidConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    let passwordsMatch = password === confirmPassword && password.length > 0;
    setValidation((validation) => ({
      ...validation,
      passwordsMatch: passwordsMatch,
    }));
    return passwordsMatch;
  };

  const isValid = () => {
    return (
      validation.hasLength &&
      validation.hasUpperAndLower &&
      validation.hasNumber &&
      validation.hasSpecial &&
      validation.passwordsMatch
    );
  };

  function closeModal() {
    setSettingsUpdatedOpen(false);
  }

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <Dialog
        as="div"
        className="relative z-10"
        open={settingsUpdatedOpen}
        onClose={closeModal}
      >
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-24 mt-10 items-center justify-center p-4 text-center">
            <Dialog.Panel className="border-2 w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle transition-all">
              <div className="mt-2 text-gray-700 text-md flex justify-between">
                <span>Your password has been successfully updated.</span>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={closeModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      <form onSubmit={changePassword} className="mt-8 space-y-6" method="POST">
        <div className="flex md:flex-row flex-col p-5 content-between">
          <div className="w-full md:w-56">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Change password
            </h3>
          </div>

          <div className="w-full">
            <div className="rounded-md -space-y-px">
              <div className="w-72">
                <label
                  htmlFor="old-password"
                  className="text-sm font-medium text-gray-900"
                >
                  Old password
                </label>
                <input
                  type="password"
                  name="old-password"
                  id="old-password"
                  autoComplete="current-password"
                  required
                  onChange={handleOldPasswordChange}
                  className={basicInputStyle()}
                />
              </div>
              <div className="w-72">
                <label
                  htmlFor="first-name"
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
                  onChange={handleNewPasswordChange}
                  className={basicInputStyle()}
                />
              </div>
              <div className="w-72">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-gray-900"
                >
                  Confirm new password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  autoComplete="new-password"
                  required
                  onChange={handleConfirmPasswordChange}
                  className={basicInputStyle()}
                />
              </div>
              <div className="my-3">
                <div className="text-sm flex flex-col w-64 rounded-md p-3">
                  <PasswordValidationRule
                    state={validation.hasLength}
                    text="At least 8 characters"
                  />
                  <PasswordValidationRule
                    state={validation.hasUpperAndLower}
                    text="Upper and lower case"
                  />
                  <PasswordValidationRule
                    state={validation.hasNumber}
                    text="A number"
                  />
                  <PasswordValidationRule
                    state={validation.hasSpecial}
                    text="Needs a special character"
                  />
                  <PasswordValidationRule
                    state={validation.passwordsMatch}
                    text="Passwords don't match"
                  />
                </div>
              </div>
            </div>
            <div className="w-56 mt-5">
              <button
                type="submit"
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
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Change password
              </button>
            </div>
          </div>
        </div>
      </form>
    </Main>
  );
};

function basicInputStyle(): string {
  return "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";
}

interface PasswordValidationRuleParams {
  state: Boolean;
  text: String;
}

function PasswordValidationRule(
  params: PasswordValidationRuleParams
): JSX.Element {
  return (
    <div className="flex">
      <span className={params.state ? "" : "hidden"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-lime-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span>{params.text}</span>
    </div>
  );
}

export default Settings;
