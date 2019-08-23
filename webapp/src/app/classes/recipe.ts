import { IRecipe } from '../interfaces/recipe';

export class Recipe implements IRecipe {
  constructor(title, image, text, url, calories, proteins, fat, carbs) {
    this.title = title;
    this.image = image;
    this.text = text;
    this.url = url;
    this.energy = {
      calories,
      proteins,
      fat,
      carbs
    };
  }

  energy: { calories: number; proteins: number; fat: number; carbs: number };
  image: string | null;
  text: string;
  title: string;
  url: string;
}
