import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { IStore } from '../../../store/reducers';
import { select, Store } from '@ngrx/store';
import { Observable, zip } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { IRecipesState } from '../../../store/reducers/recipes/recipes.reducer';
import { IRecipe } from '../../../interfaces/recipe';
import { RecipeComponent } from '../recipe/recipe.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { recipesGetPending } from '../../../store/actions/recipes/recipes.get.action';
import { IIngredient } from '../../../interfaces/ingredient';
import { Utils } from '../../../utils/utils';
import { IIngredientsState } from '../../../store/reducers/ingredients/ingredients.reducer';

@Component({
  selector: 'app-recipe-cards',
  templateUrl: './recipe-cards.component.html',
  styleUrls: ['./recipe-cards.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCardsComponent extends BaseComponent {
  private recipes$!: Observable<IShortRecipe[]>;
  private recipesCount$!: Observable<number>;
  private canShowMore: boolean;
  private recipe$!: Observable<IRecipe | null>;
  private selectedIngredients$!: Observable<IIngredient[]>;
  private selected!: IIngredient[];
  private utils: Utils;

  constructor(store: Store<IStore>, private modalService: NgbModal) {
    super(store);
    this.canShowMore = false;
    this.utils = Utils.getUtils();
  }

  init() {
    console.log('RecipeCardsComponent init');
    this.recipes$ = this.getStore().pipe(select('recipes'), map((state: IRecipesState) => state.loadedRecipes));
    this.recipesCount$ = this.getStore().pipe(select('recipes'), map((state: IRecipesState) => state.total));

    this.selectedIngredients$ = this.getStore().pipe(
      select('ingredients'),
      map((state: IIngredientsState) => state.selected));

    const selectedSub = this.selectedIngredients$.subscribe((result: IIngredient[]) => this.selected = result);
    const canShowMoreSub = zip(this.recipes$, this.recipesCount$).subscribe(([recipes, count]) => {
      this.canShowMore = count > recipes.length;
    });

    this.addSubscriptions(selectedSub, canShowMoreSub);
  }

  public trackByFn(index: number, item: IShortRecipe): string {
    return `${index}-${item.title}`;
  }

  public showMore(): void {
    const showMoreSub = this.getStore().pipe(select('recipes'), take(1)).subscribe((value: IRecipesState) => {
      if (value.currentPage === null) throw new Error(`Current page can't be null on showMore method!`);
      const payload = this.utils.getRecipeParams(this.selected, value.currentPage + 1);
      this.getStore().dispatch(recipesGetPending({ payload }));
    });
    this.addSubscriptions(showMoreSub);
  }
}
