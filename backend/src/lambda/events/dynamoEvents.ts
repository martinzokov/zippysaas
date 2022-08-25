import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import "source-map-support/register";
import Stripe from "stripe";
import { WebhookProcessingStatus } from "../../storage/StripeWebhookEvent";
import { WebhooksRepository } from "../../storage/WebhooksRepository";

import { createLogger } from "../../utils/logger";

const logger = createLogger("webhookProcessor");
const whRepo = new WebhooksRepository();


export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
) => {
  logger.info("Processing events batch from DynamoDB", JSON.stringify(event));

  for (const record of event.Records) {
    logger.info("Processing record", JSON.stringify(record));
    try {
      if (record.eventName == "INSERT") {
        await newItem(record);
      }
    } catch (error) {
      logger.error(error);
    }
  }
};

const newItem = async (record: any) => {
  const newItem = record.dynamodb.NewImage;

  const itemPk = newItem.partitionKey.S;
  if(itemPk === "WEBHOOK"){

    await whRepo.setWebhookStatus(newItem.sortKey.S, WebhookProcessingStatus.PROCESSING);
    try{
        await newStripeWebhookEvent(newItem.body.S);
    } catch(error){
        logger.error("error processing webhook: ", error);
        await whRepo.setWebhookStatus(newItem.sortKey.S, WebhookProcessingStatus.FAILED);
    }

    await whRepo.setWebhookStatus(newItem.sortKey.S, WebhookProcessingStatus.PROCESSED);
    // const body = {
    //     partitionKey: newItem.partitionKey.S,
    //     sortKey: newItem.sortKey.S,
    //     recipeName: newItem.recipeName.S,
    //     description: newItem.description.S,
    //     ingridients: newItem.ingridients.L,
    //   };
  }

};

async function newStripeWebhookEvent(eventBody: any) {
    const event: Stripe.Event = JSON.parse(eventBody);

    let subscription;
    let status;
    switch (event.type) {
        case 'customer.subscription.trial_will_end':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription trial ending.
          // handleSubscriptionTrialEnding(subscription);
          break;
        case 'customer.subscription.deleted':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription deleted.
          // handleSubscriptionDeleted(subscriptionDeleted);
          break;
        case 'customer.subscription.created':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription created.
          // handleSubscriptionCreated(subscription);
          break;
        case 'customer.subscription.updated':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription update.
          // handleSubscriptionUpdated(subscription);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }
}