import { IRecipe } from '../interfaces/recipe';
import { IRecipeIngredient } from '../interfaces/recipe-ingredient';

export class Recipe implements IRecipe {
  constructor(title, portions, text, ingredients, calories, proteins, fat, carbs) {
    this.title = title;
    this.text = text;
    this.portions = portions;
    this.ingredients = ingredients;
    this.energy = {
      calories,
      proteins,
      fat,
      carbs
    };
  }

  energy: { calories: number; proteins: number; fat: number; carbs: number };
  text: string[];
  title: string;
  ingredients: IRecipeIngredient[];
  portions: string;
}