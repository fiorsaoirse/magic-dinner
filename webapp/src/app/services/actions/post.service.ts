import { Injectable } from '@angular/core';
import { HttpSenderService } from '../http-sender.service';
import { IRecipesParams } from '../../interfaces/recipes-params';
import { Observable } from 'rxjs';
import { IRecipesCountResponse } from '../../interfaces/recipes-count-response';
import { IListRecipes } from '../../interfaces/responses/list-recipes';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpSender: HttpSenderService) {
  }

  private PAGES = 'pages';

  recipes(data: IRecipesParams): Observable<IListRecipes> {
    return this.httpSender.post<IListRecipes>(`${this.PAGES}`, data);
  }

  recipesCount(data: IRecipesParams): Observable<IRecipesCountResponse> {
    return this.httpSender.post<IRecipesCountResponse>(`${this.PAGES}/count`, data);
  }
}
