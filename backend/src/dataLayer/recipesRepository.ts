import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS);

import { Recipe } from "../models/Recipe";

import { createLogger } from "../utils/logger";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { UpgradeRequired } from "http-errors";
import * as uuid from "uuid";
const logger = createLogger("recipeRepository");

export class RecipesRepository {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly recipesTable = process.env.RECIPES_TABLE,
    private readonly usrRecipeGSIndex = process.env.INDEX_NAME
  ) {}

  async getRecipesByUser(userId: string): Promise<Recipe[]> {
    logger.info("Getting recipes for usef");

    const result = await this.docClient
      .query({
        TableName: this.recipesTable,
        KeyConditionExpression: "sortKey = :userId",
        IndexName: this.usrRecipeGSIndex,
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    const items = result.Items;
    for (let item of items) {
      item.sortKey = null;
    }
    return items as Recipe[];
  }

  async getRecipe(userId: string, recipeId: string): Promise<Recipe> {
    logger.info("Getting recipes for usef");

    const result = await this.docClient
      .query({
        TableName: this.recipesTable,
        KeyConditionExpression:
          "partitionKey = :recipeId and sortKey = :userId",
        IndexName: this.usrRecipeGSIndex,
        ExpressionAttributeValues: {
          ":userId": userId,
          ":recipeId": recipeId,
        },
      })
      .promise();

    const item = result.Items[0];
    return item as Recipe;
  }

  async createRecipe(userId: string, recipeItem: Recipe) {
    logger.info("Creating recipe item");
    const newItemId = uuid.v4();
    await this.docClient
      .put({
        TableName: this.recipesTable,
        Item: {
          partitionKey: newItemId,
          sortKey: userId,
          ...recipeItem,
        },
      })
      .promise();

    return newItemId;
  }

  async updateRecipe(recipeId: string, userId: string, updateRequest: Recipe) {
    logger.info(`Updating item ${recipeId}`);

    const updated = await this.docClient
      .update({
        TableName: this.recipesTable,
        Key: {
          partitionKey: recipeId,
          sortKey: userId,
        },
        UpdateExpression:
          "set recipeName = :name, description= :desc, preparationInfo = :prep, ingridients = :ing, cookingSteps = :steps",
        ExpressionAttributeValues: {
          ":name": updateRequest.recipeName,
          ":desc": updateRequest.description,
          ":prep": updateRequest.preparationInfo,
          ":ing": updateRequest.ingridients,
          ":steps": updateRequest.cookingSteps,
        },
        ReturnValues: "UPDATED_NEW",
      })
      .promise();

    return updated;
  }

  async deleteRecipe(recipeId: string, userId: string) {
    logger.info(`Deleting item ${recipeId}`);
    await this.docClient
      .delete({
        TableName: this.recipesTable,
        Key: {
          partitionKey: recipeId,
          sortKey: userId,
        },
      })
      .promise();
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
