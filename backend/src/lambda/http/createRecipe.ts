import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { createRecipe } from "../../businessLayer/recipesActions";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { Recipe } from "../../models/Recipe";

const logger = createLogger("createRecipe");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const newTodo: Recipe = JSON.parse(event.body);

    const userId = getUserId(event);
    console.log(userId);
    const newItemId = await createRecipe(newTodo, userId);
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ newItemId }),
    };
  } catch (error) {
    logger.error(`error during create operation ${error}`);
  }
};
