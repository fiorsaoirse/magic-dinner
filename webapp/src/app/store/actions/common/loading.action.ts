import { createAction, props } from '@ngrx/store';

const LOADING_ADD = 'LOADING_ADD';
const LOADING_REMOVE = 'LOADING_REMOVE';

export const loadingAdd = createAction(
  LOADING_ADD,
  props<{ actionId: string }>()
);
export const loadingRemove = createAction(
  LOADING_REMOVE,
  props<{ actionId: string }>()
);
