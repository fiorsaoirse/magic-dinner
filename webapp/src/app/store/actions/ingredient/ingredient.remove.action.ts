import { createAction, props } from '@ngrx/store';

const INGREDIENT_REMOVE = 'INGREDIENT_REMOVE';
const INGREDIENT_RESET = 'INGREDIENT_RESET';

export const ingredientRemove = createAction(
  INGREDIENT_REMOVE,
  props<{ id: number; }>()
);

export const ingredientReset = createAction(INGREDIENT_RESET);
