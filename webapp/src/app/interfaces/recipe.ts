import { IRecipeIngredient } from './recipe-ingredient';

export interface IRecipe {
  title: string;
  text: string[];
  portions: string;
  ingredients: IRecipeIngredient[];
  energy?: {
    calories?: number,
    proteins?: number,
    fat?: number,
    carbs?: number
  };
}
