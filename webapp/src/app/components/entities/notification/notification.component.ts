import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/utils/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  private message!: string | null;
  private classes: { [key: string]: boolean } = {
    'alert-success': false,
    'alert-warning': false,
    'alert-error': false,
    'fade-out': false,
  };

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.sub = this.notificationService.getMessage().subscribe(
      ({ message, type }) => {
        this.resetClasses();
        this.message = message;
        this.classes[`alert-${type}`] = true;
        this.classes['fade-out'] = true;
        setTimeout(() => this.message = null, 5000);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private resetClasses(): void {
    Object.keys(this.classes).forEach((key: string) => this.classes[key] = false);
  }
}
