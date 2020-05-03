import { combineReducers } from '@ngrx/store';
import { ILoadingState, loadingReducer } from './loading/loading.reducer';

export interface ICommonState {
  loading: ILoadingState;
}

export const commonReducer = combineReducers({
  loading: loadingReducer
});

