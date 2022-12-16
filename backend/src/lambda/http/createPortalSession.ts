import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
import { StripeConfigRepository } from "../../storage/StripeConfigRepository";
import { parseUserId } from "../../auth/utils";
import { SubscriptionsRepository } from "../../storage/SubscriptionsRepository";
const logger = createLogger("createPortalHandler");

const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const stripeConfigRepo = new StripeConfigRepository();
const subscriptionRepo = new SubscriptionsRepository();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const jwt = event.headers['Authorization'].split(' ')[1];
    const userId = parseUserId(jwt);
    const origin = event.headers['origin'];

    const stripeCustomerId = await subscriptionRepo.getStripeCustomerId(userId);

    const portalConfigId: string = await stripeConfigRepo.findBillingPortalConfiguration();

    const portalSession = await stripe.billingPortal.sessions.create({
      configuration: portalConfigId,
      customer: stripeCustomerId,
      return_url: origin,
    });

    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({"sessionUrl": portalSession.url})
    }

};
