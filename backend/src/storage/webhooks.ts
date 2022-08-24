import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("webhooksRepository");

export class WbhooksRepository{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly recipesTable = process.env.PAYMENTS_TABLE,
        private readonly usrRecipeGSIndex = process.env.INDEX_NAME
    ) {}

    async saveWebhook(event: any) {
        logger.info("Storing webhook");
        const newItemId = uuid.v4();
        // await this.docClient
        //   .put({
        //     TableName: this.recipesTable,
        //     Item: {
        //       partitionKey: newItemId,
        //       sortKey: userId,
        //       ...recipeItem,
        //     },
        //   })
        //   .promise();
    
        return newItemId;
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