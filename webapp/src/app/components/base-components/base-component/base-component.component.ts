import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.css']
})
export class BaseComponent implements OnInit, OnDestroy {
  // All subscriptions for component
  public subscriptions: Subscription[];

  public constructor() {
    // On init state subscription's array is empty
    this.subscriptions = [];
  }

  public init(): void {
  }

  public destroy(): void {
  }

  public addSubscription(s: Subscription) {
    this.subscriptions.push(s);
  }

  public ngOnInit(): void {
    this.init();
  }

  public ngOnDestroy(): void {
    this.destroy();
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }
}
