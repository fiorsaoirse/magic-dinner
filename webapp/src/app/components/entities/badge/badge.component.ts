import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFoundIngredient } from '../../../interfaces/found-ingredient';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent implements OnInit {

  constructor() { }

  @Input()
    item: IFoundIngredient;

  @Output()
    deleteById: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
  }

  delete(id: number): void {
    this.deleteById.emit(id);
  }

}
