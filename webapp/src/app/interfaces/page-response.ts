import { IIngridient } from './ingridient';

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
  PopularIngredients: IIngridient[];
  PopularRecipeGroupsBlock: (string | null);
  Recipes: string;
  Title: string;
  TotalCount: string;
}
