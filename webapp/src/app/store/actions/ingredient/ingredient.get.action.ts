import { createAction, props, union } from '@ngrx/store';
import { IIngredient } from '../../../interfaces/ingredient';
import { getSearchAction } from '../utils';

export const INGREDIENT_GET_PENDING = 'INGREDIENT_GET_PENDING';
const INGREDIENT_GET_SUCCESS = 'INGREDIENT_GET_SUCCESS';
const INGREDIENT_GET_FAILURE = 'INGREDIENT_GET_FAILURE';

export const ingredientGetPending = getSearchAction(INGREDIENT_GET_PENDING);
export const ingredientGetSuccess = createAction(
  INGREDIENT_GET_SUCCESS,
  props<{ payload: IIngredient[] }>()
);
export const ingredientGetFailure = createAction(INGREDIENT_GET_FAILURE);

const ingredientGetActions = union({
  ingredientGetPending,
  ingredientGetSuccess,
  ingredientGetFailure
});

export type IngredientGetActions = typeof ingredientGetActions;
