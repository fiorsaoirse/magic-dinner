import { IRecipe } from '../recipe';

export interface IPage {
  recipes: IRecipe[];
  totalCount: number;
}
