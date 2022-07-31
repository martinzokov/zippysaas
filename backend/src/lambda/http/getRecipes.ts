import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";

import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("getRecipes");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Hello, ZippySaaS!"
      }),
    };
  } catch (error) {
    logger.error(`error during recipe fetch ${error}`);
  }
};
