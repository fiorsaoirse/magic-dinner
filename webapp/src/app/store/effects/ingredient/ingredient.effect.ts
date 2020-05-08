import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { IngredientsService } from '../../../services/entities/ingredients/ingredients.service';
import { IIngredient } from '../../../interfaces/ingredient';
import { NotificationService } from '../../../services/utils/notification.service';
import {
  INGREDIENT_GET_PENDING,
  ingredientGetFailure,
  ingredientGetPending,
  ingredientGetSuccess
} from '../../actions/ingredient/ingredient.get.action';
import { of } from 'rxjs';
import { ClearService } from '../../../services/utils/clear.service';
import { ingredientAddPending, ingredientAddSuccess } from '../../actions/ingredient/ingredient.add.action';

@Injectable()
export class IngredientEffect {
  private readonly defaultErrorMessage: string;

  getIngredients$ = createEffect(() => this.actions$.pipe(
    ofType(ingredientGetPending),
    filter(action => action.actionType === INGREDIENT_GET_PENDING),
    switchMap(({ term }) => this.ingredientsService.get(term)
      .pipe(
        map((result: IIngredient[]) => {
          return ingredientGetSuccess({ payload: result });
        }),
        catchError(() => {
          this.notificationService.addErrorMessage(this.defaultErrorMessage);
          return of(ingredientGetFailure());
        })
      ))
    )
  );

  addIngredientFromSearch = createEffect(() => this.actions$.pipe(
    ofType(ingredientAddPending),
    map(({ payload }) => {
      this.clearService.next();
      return ingredientAddSuccess({ payload });
    })
  ));

  constructor(
    private actions$: Actions,
    private ingredientsService: IngredientsService,
    private notificationService: NotificationService,
    private clearService: ClearService,
  ) {
    this.defaultErrorMessage = 'Упс! Что-то пошло не так. Попробуйте снова.';
  }
}
