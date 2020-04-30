import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IStore } from '../../../store/reducers';

@Component({
  selector: 'app-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.css']
})
export class BaseComponent implements OnInit, OnDestroy {
  // All subscriptions for component
  public subscriptions: Subscription[];

  public constructor(private store: Store<IStore>) {
    // On init state subscription's array is empty
    this.subscriptions = [];
  }

  public init(): void {
  }

  public destroy(): void {
  }

  public addSubscriptions(...s: Subscription[]) {
    this.subscriptions = [...this.subscriptions, ...s];
  }

  public getStore(): Store<IStore> {
    return this.store;
  }

  public ngOnInit(): void {
    this.init();
  }

  public ngOnDestroy(): void {
    this.destroy();
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }
}
