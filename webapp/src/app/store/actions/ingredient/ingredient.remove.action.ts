import { createAction, props } from '@ngrx/store';

const INGREDIENT_REMOVE = 'INGREDIENT_REMOVE';

export const ingredientRemove = createAction(
  INGREDIENT_REMOVE,
  props<{ id: number; }>()
);
