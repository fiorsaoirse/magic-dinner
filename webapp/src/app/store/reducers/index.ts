import { ActionReducerMap } from '@ngrx/store';
import { IRecipesState, recipesReducer } from './recipes/recipes.reducer';
import { commonReducer } from './common';
import { IIngredientsState, ingredientsReducer } from './ingredients/ingredients.reducer';

export interface IStore {
  // TODO: type any
  common: any;
  ingredients: IIngredientsState;
  recipes: IRecipesState;
}

export const appReducer: ActionReducerMap<IStore> = {
  common: commonReducer,
  ingredients: ingredientsReducer,
  recipes: recipesReducer,
};
