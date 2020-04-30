import { createAction, props } from '@ngrx/store';
import { IIngredient } from '../../../interfaces/ingredient';

const INGREDIENT_ADD_PENDING = 'INGREDIENT_ADD_PENDING';
const INGREDIENT_ADD_SUCCESS = 'INGREDIENT_ADD_SUCCESS';
const INGREDIENT_ADD_FAILURE = 'INGREDIENT_ADD_FAILURE';

export const ingredientAddPending = createAction(
  INGREDIENT_ADD_PENDING,
  props<{ payload: IIngredient }>()
);

export const ingredientAddSuccess = createAction(
  INGREDIENT_ADD_SUCCESS,
  props<{ payload: IIngredient }>()
);

export const ingredientAddFailure = createAction(INGREDIENT_ADD_FAILURE);
