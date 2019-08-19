import { IRecipesParams } from '../interfaces/recipes-params';

export class RecipesParams implements IRecipesParams {
  constructor(Sorting = 'relevance', excludedIngredients, includedIngredients, tags) {
    this.Sorting = Sorting;
    this.excludedIngredients = excludedIngredients;
    this.includedIngredients = includedIngredients;
    this.tags = tags;
  }

  Sorting: string;
  excludedIngredients: number[];
  includedIngredients: number[];
  tags: string[];
}
