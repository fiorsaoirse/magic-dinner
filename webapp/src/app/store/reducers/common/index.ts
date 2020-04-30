import { combineReducers } from '@ngrx/store';
import { loadingReducer } from './loading/loading.reducer';

export const commonReducer = combineReducers({
  loading: loadingReducer
});

export type ICommonReducer = typeof commonReducer;
