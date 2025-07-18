import { Dialog, Transition } from "@headlessui/react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import {
  ChangeEventHandler,
  FormEventHandler,
  Fragment,
  useEffect,
  useState,
} from "react";

import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import PriceSelection from "@/components/pricing/PriceSelection";
import {
  createPortalSession,
  getSubscriptionDetails,
} from "@/client/BackendClient";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";

interface PasswordValidation {
  hasUpperAndLower: Boolean;
  hasNumber: Boolean;
  hasSpecial: Boolean;
  hasLength: Boolean;
  passwordsMatch: Boolean;
}

const Settings = () => {
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      getSubscriptionDetails()
        .then((response) => {
          setHasActiveSubscription(response.data.isActive);
          setSubscriptionPlan(response.data.subscriptionPlan);
        })
        .catch((response) => {
          console.error(response);
        });
    }
  }, [isAuthenticated]);

  let [settingsUpdatedOpen, setSettingsUpdatedOpen] = useState(false);
  let [planSelectionOpen, setPlanSelectionOpen] = useState(false);

  let [shouldDisplayChangePassword, setShouldDisplayChangePassword] =
    useState(false);

  useEffect(() => {
    Auth.currentUserPoolUser()
      .then((user) => {
        Auth.userAttributes(user)
          .then((attributes) => {
            setShouldDisplayChangePassword(isEmailLogin(attributes));
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

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setnewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const changePassword = async (e: React.FormEvent<HTMLInputElement>) => {
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

  const createPortalSessionSubmit = async (
    e: React.MouseEventHandler<HTMLInputElement>
  ) => {
    await createPortalSession()
      .then((response: any) => {
        window.location.href = response.data.sessionUrl;
      })
      .catch((response) => {
        console.error(response);
      });
  };

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

      <Transition appear show={planSelectionOpen} as={Fragment}>
        <Dialog
          as="div"
          className="z-10"
          open={planSelectionOpen}
          onClose={() => setPlanSelectionOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 md:inset-40 overflow-y-auto">
            <div className="flex items-center justify-center p-4 text-center">
              <Dialog.Panel className="border-2 md:w-4/6 max-w-full transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle transition-all">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => setPlanSelectionOpen(false)}
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
                <PriceSelection />
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="flex md:flex-row flex-col p-5 content-between">
        <div className="w-full md:w-56">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Manage subscription
          </h3>
        </div>
        {hasActiveSubscription ? (
          <div className="flex flex-col">
            <div className="text-sm">Current Plan: {subscriptionPlan}</div>
            <div className="w-56 mt-5">
              <button
                onClick={createPortalSessionSubmit}
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-main hover:bg-main-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Manage subscription
              </button>
            </div>{" "}
          </div>
        ) : (
          <>
            {" "}
            <a
              onClick={() => setPlanSelectionOpen(true)}
              href="#"
              className="text-white bg-main hover:main-light focus:ring-4 focus:main-light font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Select plan
            </a>
          </>
        )}
      </div>

      <div className="flex md:flex-row flex-col p-5 content-between">
        <div className="w-full md:w-56">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Change password
          </h3>
        </div>
        {shouldDisplayChangePassword ? (
          renderChangePasswordForm(
            changePassword,
            handleOldPasswordChange,
            handleNewPasswordChange,
            handleConfirmPasswordChange,
            validation
          )
        ) : (
          <div className="text-sm">Logged in with identity provider</div>
        )}
      </div>
    </Main>
  );
};

function renderChangePasswordForm(
  changePassword: FormEventHandler,
  handleOldPasswordChange: ChangeEventHandler,
  handleNewPasswordChange: ChangeEventHandler,
  handleConfirmPasswordChange: ChangeEventHandler,
  validationState: PasswordValidation
): JSX.Element {
  return (
    <form onSubmit={changePassword} className="mt-8 space-y-6" method="POST">
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
                state={validationState.hasLength}
                text="At least 8 characters"
              />
              <PasswordValidationRule
                state={validationState.hasUpperAndLower}
                text="Upper and lower case"
              />
              <PasswordValidationRule
                state={validationState.hasNumber}
                text="A number"
              />
              <PasswordValidationRule
                state={validationState.hasSpecial}
                text="Needs a special character"
              />
              <PasswordValidationRule
                state={validationState.passwordsMatch}
                text="Passwords don't match"
              />
            </div>
          </div>
        </div>
        <div className="w-56 mt-5">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-main hover:bg-main-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Change password
          </button>
        </div>
      </div>
    </form>
  );
}

function isEmailLogin(attributes: CognitoUserAttribute[]): boolean {
  return (
    attributes.filter((attribute) => attribute.Name === "email").length > 0
  );
}

function basicInputStyle(): string {
  return "appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-main focus:border-main focus:z-10 sm:text-sm";
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
