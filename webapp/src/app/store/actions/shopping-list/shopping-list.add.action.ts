import { createAction, props } from '@ngrx/store';
import { IRecipeIngredient } from 'src/app/interfaces/recipe-ingredient';

const ADD_TO_SHOPPING_LIST = 'ADD_TO_SHOPPING_LIST';

export const addToShoppingList = createAction(
    ADD_TO_SHOPPING_LIST,
    props<{ payload: IRecipeIngredient }>()
);
