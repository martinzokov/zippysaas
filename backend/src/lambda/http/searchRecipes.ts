import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";

import { getRecipe, getRecipes } from "../../businessLayer/recipesActions";
import { getUserId } from "../utils";
import { createLogger } from "../../utils/logger";
import { searchRecipesIndex } from "../../businessLayer/searchActions";
import { Recipe } from "../../models/Recipe";
const logger = createLogger("recipeSearch");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const searchTerm = event.queryStringParameters.searchTerm;
    const searchResult = await searchRecipesIndex(searchTerm);
    const foundRecipes = searchResult.hits.hits.map((searchResult) => {
      return {
        recipeId: searchResult._id,
        //@ts-ignore
        userId: searchResult._source.sortKey,
      };
    });

    if (foundRecipes.length === 0) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({}),
      };
    }
    let recipes: Recipe[] = [];
    for (let recipe of foundRecipes) {
      let loadedRecipe: Recipe = await getRecipe(
        recipe.userId,
        recipe.recipeId
      );
      if (loadedRecipe) {
        recipes.push(loadedRecipe);
      }
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ recipes }),
    };
  } catch (error) {
    logger.error(`error during recipe search ${error}`);
  }
};
