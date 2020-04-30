import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IRecipe } from '../../../interfaces/recipe';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { Store } from '@ngrx/store';
import { IStore } from '../../../store/reducers';
import { recipeClear } from '../../../store/actions/recipes/recipes.clear.action';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent extends BaseComponent {

  @Input()
  recipe!: IRecipe;

  constructor(store: Store<IStore>, public activeModal: NgbActiveModal) {
    super(store);
  }

  public close(): void {
    this.getStore().dispatch(recipeClear());
    this.activeModal.close();
  }
}
