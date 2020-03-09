import { Injectable } from '@angular/core';
import { HttpSenderService } from '../../http-sender.service';
import { Observable } from 'rxjs';
import { IFindByName } from '../../../interfaces/responses/find-by-name';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private http: HttpSenderService) { }

  private _INGREDIENTS = 'ingredients';

  get(term: string): Observable<IFindByName> {
    const params = new HttpParams().set('term', term);
    return this.http.get<IFindByName>(`${this._INGREDIENTS}/find`, params);
  }
}
