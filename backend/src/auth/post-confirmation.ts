import "source-map-support/register";

import {
    PostConfirmationTriggerEvent, PostConfirmationTriggerHandler
} from "aws-lambda";

import { createLogger } from "../utils/logger";
import { SubscriptionsRepository } from "../storage/SubscriptionsRepository";

const logger = createLogger("postConfirmation");

const subsRepository = new SubscriptionsRepository();

export const handler: PostConfirmationTriggerHandler = async (
  event: PostConfirmationTriggerEvent
): Promise<PostConfirmationTriggerEvent> => {
  try {
    logger.info(event);
    await subsRepository.saveCognitoUser(event.request.userAttributes.sub);
    return event;
  } catch (error) {
    logger.error(`error during post confirmation ${error}`);
  }
};
