import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IRecipe } from '../../../interfaces/recipe';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { select, Store } from '@ngrx/store';
import { IStore } from '../../../store/reducers';
import { recipeClear } from '../../../store/actions/recipes/recipes.clear.action';
import { Observable } from 'rxjs';
import { IIngredient } from 'src/app/interfaces/ingredient';
import { map } from 'rxjs/operators';
import { IIngredientsState } from 'src/app/store/reducers/ingredients/ingredients.reducer';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent extends BaseComponent {
  private selectedIngredients$: Observable<IIngredient[]>;

  @Input()
  recipe!: IRecipe;

  constructor(store: Store<IStore>, public activeModal: NgbActiveModal) {
    super(store);
    this.selectedIngredients$ = this.getStore().pipe(
      select('ingredients'),
      map((state: IIngredientsState) => state.selected)
    );
  }

  public init(): void {
    const sub = this.selectedIngredients$.subscribe(result => console.log(result));
    this.addSubscriptions(sub);
  }

  public destroy(): void {
    this.getStore().dispatch(recipeClear());
  }
}
