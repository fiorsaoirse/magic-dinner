import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NotificationService } from '../../../services/utils/notification.service';
import {
  recipeGetFailure,
  recipeGetPending,
  recipeGetSuccess,
  recipesGetFailure,
  recipesGetPending,
  recipesGetRandomFailure,
  recipesGetRandomPending,
  recipesGetRandomSuccess,
  recipesGetSuccess
} from '../../actions/recipes/recipes.get.action';
import { RecipesService } from '../../../services/entities/recipes/recipes.service';
import { IListRecipes } from '../../../interfaces/responses/list-recipes';
import { Utils } from '../../../utils/utils';
import { loadingAdd, loadingRemove } from '../../actions/common/loading.action';
import { IRecipesParams } from '../../../interfaces/recipes-params';
import { IRecipesCount } from '../../../interfaces/responses/recipes-count';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { IRecipe } from '../../../interfaces/recipe';

@Injectable()
export class RecipesEffect {
  private readonly defaultErrorMessage: string;
  private utils: Utils;
  private readonly recipesPerPage: number;
  private readonly fromRecipe: number;

  setLoadingTrue$ = createEffect(() => this.actions$.pipe(
    ofType(recipesGetPending, recipesGetRandomPending, recipeGetPending),
    map(() => loadingAdd({ actionId: recipesGetPending.type }))
    )
  );

  setLoadingFalse$ = createEffect(() => this.actions$.pipe(
    ofType(recipesGetSuccess, recipesGetFailure, recipesGetRandomSuccess,
           recipesGetRandomFailure, recipeGetSuccess, recipeGetFailure),
    map(() => loadingRemove({ actionId: recipesGetPending.type }))
    )
  );

  loadRecipes$ = createEffect(() => this.actions$.pipe(
    ofType(recipesGetPending),
    switchMap(({ payload }) => this.recipesService.listRecipes(payload)
      .pipe(
        map((payload: IListRecipes) => recipesGetSuccess({ payload })),
        catchError((err: any) => {
          console.error(err);
          this.notificationService.addErrorMessage(this.defaultErrorMessage);
          return of(recipesGetFailure());
        })
      ))
    )
  );

  loadRecipe$ = createEffect(() => this.actions$.pipe(
    ofType(recipeGetPending),
    switchMap(({ payload }) => this.recipesService.get(payload)),
    map((payload: IRecipe) => recipeGetSuccess({ payload })),
    catchError((err: any) => {
      console.error(err);
      this.notificationService.addErrorMessage(this.defaultErrorMessage);
      return of(recipeGetFailure());
    })
  ));

  loadRandomRecipe$ = createEffect(() => this.actions$.pipe(
    ofType(recipesGetRandomPending),
    switchMap(({ payload }) => this.recipesService.recipesCount(payload).pipe(
      map((result: IRecipesCount) => {
        const totalNum = parseInt(result.total, 10);
        const pagesCount = Math.floor(totalNum / this.recipesPerPage);
        const randomPage = this.utils.getRandomNumber(this.fromRecipe, pagesCount);
        return ({ ...payload, page: randomPage });
      })
    )),
    switchMap((updatedRecipeParams: IRecipesParams) => this.recipesService.listRecipes(updatedRecipeParams)),
    map((result: IListRecipes) => {
      const { data } = result;
      const randomRecipe = this.utils.getRandomNumber(this.fromRecipe, this.recipesPerPage);
      return data[randomRecipe];
    }),
    switchMap((recipe: IShortRecipe) => this.recipesService.get(recipe.url)),
    map((payload: IRecipe) => recipesGetRandomSuccess({ payload })),
    catchError((err: any) => {
      console.error(err);
      this.notificationService.addErrorMessage(this.defaultErrorMessage);
      return of(recipesGetRandomFailure());
    })
  ));

  constructor(
    private actions$: Actions,
    private recipesService: RecipesService,
    private notificationService: NotificationService,
  ) {
    this.defaultErrorMessage = 'Упс! Что-то пошло не так. Попробуйте снова.';
    this.utils = Utils.getUtils();
    this.recipesPerPage = 14;
    this.fromRecipe = 1;
  }
}
