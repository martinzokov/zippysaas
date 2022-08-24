import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";


import { createLogger } from "../../utils/logger";
import { WebhooksRepository } from "../../storage/WebhooksRepository";
import { StripeWebhookEvent } from "../../storage/StripeWebhookEvent";
const logger = createLogger("getExample");

const stripe = require('stripe')('sk_test_51LTpa2JDqfS8yHgviefD8PKqcnyTXKwn2Bp5OTL2VmhnstVKeHcYDF10g9Q9lENlerlOjKp2JocqdDd1jEG5WTWO00opvTH1c1');

const whRepo = new WebhooksRepository();

export const handler: APIGatewayProxyHandler = async (
  stripeEvent: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  console.log("stripeEvent is: "+ JSON.stringify(stripeEvent))
  let event = stripeEvent.body;
  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret = 'whsec_cN8JSgk5z6sZPG0CIZXljwXAkkFYGn2s';
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    console.log("stripeEvent.headers is: "+ JSON.stringify(stripeEvent.headers))
    const signature = stripeEvent.headers['Stripe-Signature'];
    console.log("signature is: "+ signature)
    try {
      event = stripe.webhooks.constructEvent(
        stripeEvent.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return {
        statusCode: 400,
        body: ''
      }
    }
  }
  let subscription;
  let status;
  let constructedEvent = event as any;
  await whRepo.saveWebhook(new StripeWebhookEvent(constructedEvent.id, stripeEvent.body));
  // Handle the event
  switch (constructedEvent.type) {
    case 'customer.subscription.trial_will_end':
      subscription = constructedEvent.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break;
    case 'customer.subscription.deleted':
      subscription = constructedEvent.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break;
    case 'customer.subscription.created':
      subscription = constructedEvent.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break;
    case 'customer.subscription.updated':
      subscription = constructedEvent.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${constructedEvent.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  return{
    statusCode: 200,
    body: ''
  }

};
