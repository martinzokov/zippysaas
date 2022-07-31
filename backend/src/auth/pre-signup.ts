import "source-map-support/register";

import {
    PreSignUpTriggerHandler,
    PreSignUpTriggerEvent
} from "aws-lambda";

import { createLogger } from "../utils/logger";

const logger = createLogger("preSignUp");

export const handler: PreSignUpTriggerHandler = async (
  event: PreSignUpTriggerEvent
): Promise<PreSignUpTriggerEvent> => {
  try {
    // Confirm the user
    event.response.autoConfirmUser = true;

    // Set the email as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty("email")) {
        event.response.autoVerifyEmail = true;
    }

    // Set the phone number as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty("phone_number")) {
        event.response.autoVerifyPhone = true;
    }

    return event;
  } catch (error) {
    logger.error(`error during pre-signup ${error}`);
  }
};
