import { Injectable } from '@angular/core';
import { HttpSenderService } from '../http-sender.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFindByName } from '../../interfaces/responses/find-by-name';
import { IRecipe } from '../../interfaces/recipe';

@Injectable({
  providedIn: 'root'
})
export class GetService {

  constructor(private httpSender: HttpSenderService) {
  }

  private INGREDIENTS = 'ingredients';
  private RECIPES = 'recipes';

  getIngredient(term: string): Observable<IFindByName> {
    const params = new HttpParams().set('term', term);
    return this.httpSender.get<IFindByName>(`${this.INGREDIENTS}/find`, params);
  }

  getRecipe(link: string): Observable<IRecipe> {
    const params = new HttpParams().set('link', link);
    return this.httpSender.get<IRecipe>(`${this.RECIPES}/get`, params);
  }
}
