import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient, ExpressionAttributeValueMap, ItemList, UpdateExpression } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { StripeWebhookEvent, WebhookProcessingStatus } from "./StripeWebhookEvent";

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("repository");


export abstract class AbstractRepository{
  abstract tableName: string;
  abstract index: string;

  constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
  ) {}

  async save(partitionKey: string, sortKey: string, object: any) {
      logger.info("Storing webhook");
      try{
        await this.docClient
        .put({
          TableName: this.tableName,
          Item: {
            partitionKey: partitionKey,
            sortKey: sortKey,
            ...object
          },
        })
        .promise();
      } catch(e){
        logger.error("error saving object: ", e)
      }
      
      return partitionKey;
  }

  async queryBySortKey(sortKeyValue: string) {
    logger.info("Storing webhook");
    let items: ItemList = [];
    try{
      const result = await this.docClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: "sortKey = :sortKeyValue",
        IndexName: this.index,
        ExpressionAttributeValues: {
          ":sortKeyValue": sortKeyValue,
        },
      })
      .promise();

      items = result.Items;
    } catch(e){
      logger.error("error fetching object: ", e)
    }
    logger.info("items found: ", items);
    
    return items;
} 

  async update(parittionKey: string, sortKey: string, updateExpression: UpdateExpression, expressionAttributesValues: ExpressionAttributeValueMap ) {
    logger.info("Storing webhook");
    try{
      await this.docClient
      .update({
        TableName: this.tableName,
        Key: {
          partitionKey: parittionKey,
          sortKey: sortKey,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributesValues,
        ReturnValues: "UPDATED_NEW",
      })
      .promise();
    } catch(e){
      logger.error("error updating object: ", e)
    }
    
    return parittionKey;
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