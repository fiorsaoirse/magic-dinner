import { createAction, props, union } from '@ngrx/store';
import { IListRecipes } from '../../../interfaces/responses/list-recipes';
import { IRecipesParams } from '../../../interfaces/recipes-params';
import { IRecipe } from '../../../interfaces/recipe';

const RECIPES_GET_PENDING = 'RECIPES_GET_PENDING';
const RECIPES_GET_SUCCESS = 'RECIPES_GET_SUCCESS';
const RECIPES_GET_FAILURE = 'RECIPES_GET_FAILURE';

const RECIPES_GET_RANDOM_PENDING = 'RECIPES_GET_RANDOM_PENDING';
const RECIPES_GET_RANDOM_SUCCESS = 'RECIPES_GET_RANDOM_SUCCESS';
const RECIPES_GET_RANDOM_FAILURE = 'RECIPES_GET_RANDOM_FAILURE';

/* Getting list of recipes by params */
export const recipesGetPending = createAction(
  RECIPES_GET_PENDING,
  props<{ payload: IRecipesParams }>()
);
export const recipesGetSuccess = createAction(
  RECIPES_GET_SUCCESS,
  props<{ payload: IListRecipes }>()
);
export const recipesGetFailure = createAction(RECIPES_GET_FAILURE);

/* Getting random recipe */
export const recipesGetRandomPending = createAction(
  RECIPES_GET_RANDOM_PENDING,
  props<{ payload: IRecipesParams }>()
);
export const recipesGetRandomSuccess = createAction(
  RECIPES_GET_RANDOM_SUCCESS,
  props<{ payload: IRecipe }>()
);
export const recipesGetRandomFailure = createAction(RECIPES_GET_RANDOM_FAILURE);

const recipesGetActions = union({
  recipesGetPending,
  recipesGetSuccess,
  recipesGetFailure
});

const recipesGetRandomActions = union({
  recipesGetRandomPending,
  recipesGetRandomSuccess,
  recipesGetRandomFailure
});

export type RecipesGetActions = typeof recipesGetActions;
export type RecipesGetRandomActions = typeof recipesGetRandomActions;

