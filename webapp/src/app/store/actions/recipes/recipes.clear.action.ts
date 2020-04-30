import { createAction } from '@ngrx/store';

const RECIPE_CLEAR = 'RECIPE_CLEAR';

export const recipeClear = createAction(RECIPE_CLEAR);
