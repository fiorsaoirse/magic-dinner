import { IShortRecipe } from '../../../interfaces/short-recipe';
import {
  recipesGetFailure,
  recipesGetRandomSuccess,
  recipesGetSuccess
} from '../../actions/recipes/recipes.get.action';
import { createReducer, on } from '@ngrx/store';
import { IRecipe } from '../../../interfaces/recipe';
import { recipeClear } from '../../actions/recipes/recipes.clear.action';

export interface IRecipesState {
  loadedRecipes: IShortRecipe[];
  recipeToShow: IRecipe | null;
  total: number;
  currentPage: number | null;
}

const initialState: IRecipesState = {
  loadedRecipes: [],
  recipeToShow: null,
  total: 0,
  currentPage: null
};

export const recipesReducer = createReducer(
  initialState,
  on(recipesGetSuccess, (state, { payload }) => {
    const { data } = payload;
    const { currentPage, loadedRecipes } = state;
    const recipes = currentPage === null ? data : [...loadedRecipes, ...data];
    const nextPage = currentPage === null ? 1 : currentPage + 1;
    return({
      ...state,
      currentPage: nextPage,
      loadedRecipes: recipes,
    });
  }),
  on(recipesGetFailure, state => state),
  on(recipesGetRandomSuccess, (state, { payload }) => {
    return ({
      ...state,
      recipeToShow: payload,
    });
  }),
  on(recipeClear, state  => ({ ...state, recipeToShow: null }))
);
