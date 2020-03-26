import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  private _initScrollAction$$ = new Subject<boolean>();

  public getScrollActions(): Observable<boolean> {
    return this._initScrollAction$$.asObservable();
  }

  public initScrollActionNext(value: boolean): void {
    this._initScrollAction$$.next(value);
  }

}
