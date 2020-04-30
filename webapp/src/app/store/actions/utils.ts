import { createAction } from '@ngrx/store';
import { FunctionWithParametersType, TypedAction } from '@ngrx/store/src/models';

const SEARCH_ACTION = 'SEARCH_ACTION';

export type SearchActionType = FunctionWithParametersType<[string], { actionType: string; term: string }
& TypedAction<string>> & TypedAction<string>;

export const getSearchAction = (actionType: string): SearchActionType  =>
  createAction(SEARCH_ACTION, (term: string) => ({ term, actionType }));

