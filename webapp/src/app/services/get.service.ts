import { Injectable } from '@angular/core';
import { HttpSenderService } from './http-sender.service';
import { IRecipesParams } from '../interfaces/recipes-params';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPageResponse } from '../interfaces/page-response';
import { IRecipesCountResponse } from '../interfaces/recipes-count-response';
import { IFindByName } from '../interfaces/responses/find-by-name';

@Injectable({
  providedIn: 'root'
})
export class GetService {

  constructor(private httpSender: HttpSenderService) {
  }

  private getRecipesCountAddress = 'getRecipesCount';
  private getPageAddress = 'getPage';
  private findByNameAddress = 'findByName';

  getRecipes(data: IRecipesParams): Observable<IPageResponse> {
    return this.httpSender.post<IPageResponse>(this.getPageAddress, data);
  }

  getRecipesCount(data: IRecipesParams): Observable<IRecipesCountResponse> {
    return this.httpSender.post<IRecipesCountResponse>(this.getRecipesCountAddress, data);
  }

  findByName(term: string): Observable<IFindByName> {
    const params = new HttpParams().set('term', term);
    return this.httpSender.get<IFindByName>(this.findByNameAddress, params);
  }
}
