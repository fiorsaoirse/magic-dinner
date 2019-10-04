import { IRecipesParams } from '../interfaces/recipes-params';

export class RecipesParams implements IRecipesParams {
  constructor(excludedIngredients: number[], includedIngredients: number[],
              // tslint:disable-next-line:variable-name
              tags: string[], Sorting?: string, page?: (number | null)) {
    this.Sorting = Sorting || 'relevance';
    this.excludedIngredients = excludedIngredients;
    this.includedIngredients = includedIngredients;
    this.tags = tags;
    this.page = page;
  }

  // tslint:disable-next-line:variable-name
  Sorting?: string;
  excludedIngredients: number[];
  includedIngredients: number[];
  tags: string[];
  page?: (number | null);
}
