import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";

import { updateRecipe } from "../../businessLayer/recipesActions";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { Recipe } from "../../models/Recipe";

const logger = createLogger("updateRecipe");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const recipeId = event.pathParameters.recipeId;
    const updatedRecipe: Recipe = JSON.parse(event.body);

    const userId = getUserId(event);
    const update = await updateRecipe(recipeId, userId, updatedRecipe);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(update),
    };
  } catch (error) {
    logger.error(`error during recipe update ${error}`);
  }
};
