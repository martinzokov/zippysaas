import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";
import { StripeWebhookEvent, WebhookProcessingStatus } from "./StripeWebhookEvent";

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("webhooksRepository");

const WEBHOOK_PK = "WEBHOOK";

export class WebhooksRepository{
  constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly webhooksTable = process.env.PAYMENTS_TABLE,
      private readonly GSIndex = process.env.INDEX_NAME
  ) {}

  async saveWebhook(event: StripeWebhookEvent) {
      logger.info("Storing webhook");
      try{
        await this.docClient
        .put({
          TableName: this.webhooksTable,
          Item: {
            partitionKey: WEBHOOK_PK,
            sortKey: event.id,
            ...event
          },
        })
        .promise();
      } catch(e){
        logger.error("error saving webhook: ", e)
      }
      
  
      return event.id;
  } 

  async setWebhookStatus(eventId: string, status: WebhookProcessingStatus) {
    logger.info("Storing webhook");
    try{
      const updated = await this.docClient
      .update({
        TableName: this.webhooksTable,
        Key: {
          partitionKey: WEBHOOK_PK,
          sortKey: eventId,
        },
        UpdateExpression:
          "set status = :status",
        ExpressionAttributeValues: {
          ":name": status,
        },
        ReturnValues: "UPDATED_NEW",
      })
      .promise();
    } catch(e){
      logger.error("error saving webhook: ", e)
    }
    
    return eventId;
} 
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log("Creating a local DynamoDB instance");
      return new XAWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:8000",
      });
    }
    return new XAWS.DynamoDB.DocumentClient();
  }