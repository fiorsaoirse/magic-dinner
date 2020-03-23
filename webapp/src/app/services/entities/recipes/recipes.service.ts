import { Injectable } from '@angular/core';
import { HttpSenderService } from '../../http-sender.service';
import { Observable } from 'rxjs';
import { IRecipe } from '../../../interfaces/recipe';
import { HttpParams } from '@angular/common/http';
import { IRecipesParams } from '../../../interfaces/recipes-params';
import { IListRecipes } from '../../../interfaces/responses/list-recipes';
import { IRecipesCount } from '../../../interfaces/responses/recipes-count';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {

  constructor(private http: HttpSenderService) { }

  private _RECIPES = 'recipes';
  private _PAGES = 'pages';

  get(link: string): Observable<IRecipe> {
    const params = new HttpParams().set('link', encodeURIComponent(link));
    return this.http.get<IRecipe>(`${this._RECIPES}/get`, params);
  }

  listRecipes(data: IRecipesParams): Observable<IListRecipes> {
    return this.http.post<IListRecipes>(`${this._PAGES}`, data);
  }

  recipesCount(data: IRecipesParams): Observable<IRecipesCount> {
    return this.http.post<IRecipesCount>(`${this._PAGES}/count`, data);
  }
}
