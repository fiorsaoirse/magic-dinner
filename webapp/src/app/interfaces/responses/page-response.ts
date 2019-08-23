import { IRecipe } from '../recipe';

export interface IPageResponse {
  recipes: IRecipe[];
  totalCount: number;
}
