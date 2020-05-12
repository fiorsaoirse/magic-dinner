import { IRecipeIngredient } from 'src/app/interfaces/recipe-ingredient';
import { createReducer, on } from '@ngrx/store';
import { addToShoppingList } from '../../actions/shopping-list/shopping-list.add.action';

export interface IShoppingListState {
  list: IRecipeIngredient[];
}

const initialState: IShoppingListState = {
  list: [],
};

export const shoppingListReducer = createReducer(
    initialState,
    on(addToShoppingList, (state, { payload }) => {
      const { list } = state;
      return ({
        ...state,
        list: [...list, payload],
      });
    })
);
