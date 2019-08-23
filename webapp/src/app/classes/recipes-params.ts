import { IRecipesParams } from '../interfaces/recipes-params';

export class RecipesParams implements IRecipesParams {
  // tslint:disable-next-line:variable-name
  constructor(Sorting = 'relevance', excludedIngredients, includedIngredients, tags) {
    this.Sorting = Sorting;
    this.excludedIngredients = excludedIngredients;
    this.includedIngredients = includedIngredients;
    this.tags = tags;
  }

  // tslint:disable-next-line:variable-name
  Sorting: string;
  excludedIngredients: number[];
  includedIngredients: number[];
  tags: string[];
}
