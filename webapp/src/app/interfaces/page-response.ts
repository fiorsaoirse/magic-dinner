import { IIngredient } from './ingredient';

export interface IPageResponse {
  AfterCut: (string | null);
  BeforeCut: (string | null);
  Breadcrumbs: string;
  CatalogPhoto: (string | null);
  CurrentUrl: string;
  Description: (string | null);
  HasMore: true;
  Heading: string;
  Icon: (string | null);
  IngredientCatalogModel: (string | null);
  PopularIngredients: IIngredient[];
  PopularRecipeGroupsBlock: (string | null);
  Recipes: string;
  Title: string;
  TotalCount: string;
}
