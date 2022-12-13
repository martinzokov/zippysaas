import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
import { parseUserId } from "../../auth/utils";
import { SubscriptionsRepository } from "../../storage/SubscriptionsRepository";
import { StripeSubscription } from "../../storage/StripeSubscription";
import Stripe from "stripe";
import { Feature } from "../../storage/models/Feature";
import { SubscriptionDetailsResponse } from "./models/SubscriptionDetailsResponse";
import { StripeProduct } from "../../storage/models/StripeProduct";
import { StripeConfigRepository } from "../../storage/StripeConfigRepository";
const logger = createLogger("subscriptionDetailsHandler");
const subscriptionsRepository = new SubscriptionsRepository();
const stripeRepository = new StripeConfigRepository();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const jwt = event.headers['Authorization'].split(' ')[1];
    const userId = parseUserId(jwt);
    
    const subscription: StripeSubscription = await subscriptionsRepository.getCustomerSubscription(userId);
    const subscriptionDetails: Stripe.Subscription = JSON.parse(subscription.body);
    
    const productIds: string[] = subscriptionDetails.items.data
                                    .filter(item => item.object === "subscription_item")
                                    .map(item => item.plan.product as string);
    
    if(productIds.length !== 1){
        throw new Error("more than one product subscriptions found");
    }

    const product: StripeProduct = await stripeRepository.findProduct(productIds[0]);
    const productDetails: Stripe.Product = JSON.parse(product.data);

    const featureCodes: string[] = await (await subscriptionsRepository.getProductFeatures(productIds[0])).map(feature=>feature.featureCode);
    
    const response = new SubscriptionDetailsResponse(productDetails.name, getIsActive(subscription), featureCodes);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    logger.error(`error during example fetch ${error}`);
    return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: "error",
      };
  }
};

function getIsActive(subscription: StripeSubscription): boolean{
    const now = new Date();
    return new Date(subscription.expiresAt * 1000) > now;
}