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

const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (stripeWebhookSecret) {
    // Get the signature sent by Stripe
    console.log("stripeEvent.headers is: "+ JSON.stringify(stripeEvent.headers))
    const signature = stripeEvent.headers['Stripe-Signature'];
    console.log("signature is: "+ signature)
    try {
      event = stripe.webhooks.constructEvent(
        stripeEvent.body,
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return {
        statusCode: 400,
        body: ''
      }
    }
  }
  let constructedEvent = event as any;
  const eventId = constructedEvent.id
  const recordsWithKey = await whRepo.findWebhookByIdempotencyKey(eventId)
  if(recordsWithKey.length == 0){
    await whRepo.saveWebhook(new StripeWebhookEvent(eventId, stripeEvent.body));
  }
  
  // Return a 200 response to acknowledge receipt of the event
  return{
    statusCode: 200,
    body: ''
  }

};
