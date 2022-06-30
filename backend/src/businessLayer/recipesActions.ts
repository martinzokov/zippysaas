import { Recipe } from "../models/Recipe";
import { RecipesRepository } from "../dataLayer/recipesRepository";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const recipesRepo = new RecipesRepository();

export async function getRecipes(userId: string): Promise<Recipe[]> {
  return recipesRepo.getRecipesByUser(userId);
}

export async function getRecipe(
  userId: string,
  recipeId: string
): Promise<Recipe> {
  return recipesRepo.getRecipe(userId, recipeId);
}

export async function createRecipe(
  createRecipeRequest: Recipe,
  userId: string
): Promise<string> {
  createRecipeRequest.createdAt = new Date().toISOString();
  return await recipesRepo.createRecipe(userId, createRecipeRequest);
}

export async function updateRecipe(
  todoId: string,
  userId: string,
  updateRequest: Recipe
) {
  return await recipesRepo.updateRecipe(todoId, userId, updateRequest);
}

export async function deleteRecipe(recipeId: string, userId: string) {
  return await recipesRepo.deleteRecipe(recipeId, userId);
}
