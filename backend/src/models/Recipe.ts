export interface Recipe {
    recipeName: string;
    description: string;
    preparationInfo: CookingTimeInfo;
    ingridients: string[];
    cookingSteps: CookingStep[];
    createdAt: string;
  }
  

export interface CookingTimeInfo{
    preparationQuantity: number;
    preparationScale: TimeScale;
    cookingQuantity: number;
    cookingScale: TimeScale;
}

export type TimeScale = "minutes" | "hours"

export interface CookingStep{
    order: number;
    description: string;
    imageUrl: string;
}