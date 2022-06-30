import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";

import { getRecipes } from "../../businessLayer/recipesActions";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("getRecipes");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    //const userId = getUserId(event);
    const items = {"str": "hello"} ;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        items,
      }),
    };
  } catch (error) {
    logger.error(`error during recipe fetch ${error}`);
  }
};
