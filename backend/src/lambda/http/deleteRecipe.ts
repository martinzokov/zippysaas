import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";

import { deleteRecipe } from "../../businessLayer/recipesActions";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("deleteRecipe");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const recipeId = event.pathParameters.recipeId;
    const userId = getUserId(event);

    await deleteRecipe(recipeId, userId);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "",
    };
  } catch (error) {
    logger.error(`error during delete operation ${error}`);
  }
};
