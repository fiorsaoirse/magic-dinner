import { IIngredient } from '../../../interfaces/ingredient';
import { createReducer, on } from '@ngrx/store';
import { ingredientGetSuccess } from '../../actions/ingredient/ingredient.get.action';
import { ingredientAddSuccess } from '../../actions/ingredient/ingredient.add.action';
import { ingredientRemove, ingredientReset } from '../../actions/ingredient/ingredient.remove.action';

export interface IIngredientsState {
  selected: IIngredient[];
  found: IIngredient[];
}

const initialState: IIngredientsState = {
  selected: [],
  found: [],
};

export const ingredientsReducer = createReducer(
  initialState,
  on(ingredientGetSuccess, (state, { payload }) => {
    return ({
      ...state,
      found: payload,
    });
  }),
  on(ingredientAddSuccess, (state, { payload }) => {
    const { selected } = state;
    return ({
      // When user adds ingredient to selected we have to clear "found" array of ingredients
      found: [],
      selected: [...selected, payload],
    });
  }),
  on(ingredientRemove, (state, { id }) => {
    const { selected } = state;
    return ({
      ...state,
      selected: selected.filter(element => element.ObjectID !== id),
    });
  }),
  on(ingredientReset, state => ({ ...state, found: [] })),
);
