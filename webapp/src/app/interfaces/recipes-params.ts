export interface IRecipesParams {
  Sorting?: string;
  excludedIngredients: number[];
  includedIngredients: number[];
  tags: string[];
  page?: (number | null);
}
