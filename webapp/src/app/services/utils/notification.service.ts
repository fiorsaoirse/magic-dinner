import { Injectable } from '@angular/core';
import { NotificationType } from '../../objects/notification-types.enum';
import { Observable, Subject } from 'rxjs';

export interface INotification {
  type: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private message$$: Subject<INotification>;

  constructor() {
    this.message$$ = new Subject<INotification>();
  }

  public addSuccessMessage(message: string): void {
    this.addMessage(NotificationType.SUCCESS, message);
  }

  public addWarningMessage(message: string): void {
    this.addMessage(NotificationType.WARNING, message);
  }

  public addErrorMessage(message: string): void {
    this.addMessage(NotificationType.DANGER, message);
  }

  public getMessage(): Observable<INotification> {
    return this.message$$.asObservable();
  }

  private addMessage(type: string, message: string): void {
    this.message$$.next({ type, message });
  }
}
