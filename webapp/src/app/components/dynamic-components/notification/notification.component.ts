import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  private classes: { [key: string]: boolean } = {
    'alert-success': false,
    'alert-warning': false,
    'alert-error': false,
    'fade-out': false,
  };

  constructor() {}

  @Input()
  message!: string;
  @Input()
  type!: string;

  ngOnInit(): void {
    this.classes[`alert-${this.type}`] = true;
    this.classes['fade-out'] = true;
  }

  ngOnDestroy(): void {}
}
