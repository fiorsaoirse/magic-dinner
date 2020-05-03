import { ActionReducerMap } from '@ngrx/store';
import { IRecipesState, recipesReducer } from './recipes/recipes.reducer';
import { commonReducer, ICommonState } from './common';
import { IIngredientsState, ingredientsReducer } from './ingredients/ingredients.reducer';

export interface IStore {
  common: ICommonState;
  ingredients: IIngredientsState;
  recipes: IRecipesState;
}

export const appReducer: ActionReducerMap<IStore> = {
  common: commonReducer,
  ingredients: ingredientsReducer,
  recipes: recipesReducer,
};
