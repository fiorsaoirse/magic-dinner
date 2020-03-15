import { Injectable } from '@angular/core';
import { HttpSenderService } from '../../http-sender.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { IFoundIngredient } from '../../../interfaces/found-ingredient';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private http: HttpSenderService) { }

  private _INGREDIENTS = 'ingredients';

  get(term: string): Observable<IFoundIngredient[]> {
    const params = new HttpParams().set('term', term);
    return this.http.get<{ data: IFoundIngredient[] }>(`${this._INGREDIENTS}/find`, params)
      .pipe(map((resp: { data: IFoundIngredient[] }) => resp.data));
  }
}
