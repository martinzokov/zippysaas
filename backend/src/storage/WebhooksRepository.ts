import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { AttributeValue, DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { StripeWebhookEvent, WebhookProcessingStatus } from "./StripeWebhookEvent";
import { AbstractRepository } from "./AbstractRepository";

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("webhooksRepository");

const WEBHOOK_PK = "WEBHOOK";

export class WebhooksRepository extends AbstractRepository{
  tableName: string = process.env.PAYMENTS_TABLE;
  index: string = process.env.INDEX_NAME;

  constructor(
  ) {
    super();
  }

  async saveWebhook(event: StripeWebhookEvent) {
      logger.info("Storing webhook");
      try{
        await this.save(WEBHOOK_PK, event.id, event);
      } catch(e){
        logger.error("error saving webhook: ", e)
      }
      
      return event.id;
  } 

  async findWebhookByIdempotencyKey(idempotencyKey: string) {
    logger.info("Storing webhook");
    try{
      return await this.queryBySortKey(idempotencyKey);
    } catch(e){
      logger.error("error saving webhook: ", e)
    }
    
    return [];
  } 

  async setWebhookStatus(eventId: string, processing_status: WebhookProcessingStatus) {
    logger.info("Storing webhook");
    try{
      await this.update(WEBHOOK_PK, eventId, "set processing_status = :processing_status",  {
        ":processing_status": processing_status as AttributeValue,
      })
    } catch(e){
      logger.error("error saving webhook: ", e)
    }
    
    return eventId;
  } 
}
