import { createReducer, on } from '@ngrx/store';
import { loadingAdd, loadingRemove } from '../../../actions/common/loading.action';

export interface ILoadingState {
  count: number;
  actions: string[];
}

const initialState: ILoadingState = {
  count: 0,
  actions: []
};

export const loadingReducer = createReducer(
  initialState,
  on(loadingAdd, (state, { actionId }) => {
    const inProgress = state.actions.filter(action => action === actionId).length !== 0;
    if (inProgress) return state;
    const { count, actions } = state;
    return ({
      count: count + 1,
      actions: [...actions, actionId]
    });
  }),
  on(loadingRemove, (state, { actionId }) => {
    const inProgress = state.actions.filter(action => action === actionId).length !== 0;
    if (!inProgress) return state;
    const { count, actions } = state;
    return ({
      count: count - 1,
      actions: actions.filter(action => action !== actionId)
    });
  }),
);
