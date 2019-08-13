import { Injectable } from '@angular/core';
import { HttpSenderService } from './http-sender.service';
import { IRecipesParams } from '../interfaces/recipes-params';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPageResponse } from '../interfaces/page-response';
import { IFoundIngridient } from '../interfaces/found-ingridient';
import { IRecipesCountResponse } from '../interfaces/recipes-count-response';

@Injectable({
  providedIn: 'root'
})
export class GetService {

  constructor(private httpSender: HttpSenderService) {
  }

  private getRecipesCountAddress = 'https://eda.ru/RecipesCatalog/GetRecipesCount';
  private getPageAddress = 'https://eda.ru/RecipesCatalog/GetPage';
  private findByNameAddress = 'https://eda.ru/Ingredient/FindByName';

  getRecipes(data: IRecipesParams): Observable<IPageResponse> {
    return this.httpSender.post<IPageResponse>(this.getPageAddress, data);
  }

  getRecipesCount(data: IRecipesParams): Observable<IRecipesCountResponse> {
    return this.httpSender.post<IRecipesCountResponse>(this.getRecipesCountAddress, data);
  }

  findByName(term: string): Observable<IFoundIngridient[]> {
    const params = new HttpParams().set('term', term);
    return this.httpSender.get<IFoundIngridient[]>(this.findByNameAddress, params);
  }
}
