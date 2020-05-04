import { Component, Input } from '@angular/core';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipesService } from '../../../services/entities/recipes/recipes.service';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { Store } from '@ngrx/store';
import { IStore } from '../../../store/reducers';
import { recipeGetPending } from 'src/app/store/actions/recipes/recipes.get.action';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-cards-item.component.html',
  styleUrls: ['./recipe-cards-item.component.css']
})
export class RecipeCardsItemComponent extends BaseComponent {

  constructor(store: Store<IStore>) {
    super(store);
  }

  @Input()
  card?: IShortRecipe;

  init(): void {}

  openRecipe(url: string): void {
    this.getStore().dispatch(recipeGetPending({ payload: url }));
  }
}
