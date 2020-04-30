import { Component, Input } from '@angular/core';
import { IIngredient } from '../../../interfaces/ingredient';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { IStore } from '../../../store/reducers';
import { Store } from '@ngrx/store';
import { ingredientRemove } from '../../../store/actions/ingredient/ingredient.remove.action';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent extends BaseComponent {

  constructor(store: Store<IStore>) { super(store); }

  @Input()
    item!: IIngredient;

  public delete(id: number): void {
    this.getStore().dispatch(ingredientRemove({ id }));
  }

}
