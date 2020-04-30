import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClearService {
  constructor() {
  }
  private clearSearch$$ = new Subject<void>();

  public next(): void {
    this.clearSearch$$.next();
  }

  public getClear(): Observable<void> {
    return this.clearSearch$$.asObservable();
  }
}
