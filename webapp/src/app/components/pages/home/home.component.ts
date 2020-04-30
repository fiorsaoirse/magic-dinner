import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IIngredient } from '../../../interfaces/ingredient';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { SearchUILabels } from '../../entities/search/search.component';
import { Utils } from '../../../utils/utils';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../../services/utils/notification.service';
import { select, Store } from '@ngrx/store';
import { IStore } from '../../../store/reducers';
import { recipesGetPending, recipesGetRandomPending } from '../../../store/actions/recipes/recipes.get.action';
import { IRecipesState } from '../../../store/reducers/recipes/recipes.reducer';
import { SearchActionType } from '../../../store/actions/utils';
import { ingredientGetPending } from '../../../store/actions/ingredient/ingredient.get.action';
import { IIngredientsState } from '../../../store/reducers/ingredients/ingredients.reducer';
import { ingredientAddPending } from '../../../store/actions/ingredient/ingredient.add.action';
import { IRecipe } from '../../../interfaces/recipe';
import { RecipeComponent } from '../../entities/recipe/recipe.component';

interface Labels {
  search: SearchUILabels;
  buttons: {
    [key: string]: string;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends BaseComponent {
  private utils: Utils;
  private labels: Labels;
  private action: SearchActionType;
  private recipes$!: Observable<IShortRecipe[]>;
  private selectedIngredients$!: Observable<IIngredient[]>;
  private selected!: IIngredient[];
  private foundIngredients$!: Observable<IIngredient[]>;
  private recipe$!: Observable<IRecipe | null>;

  constructor(store: Store<IStore>,
              private notificationService: NotificationService,
              private modalService: NgbModal) {
    super(store);
    this.utils = Utils.getUtils();
    this.labels = {
      search: {
        question: 'Какие продукты есть в холодильнике?',
        hint: '* Название должно содержать не менее 3 символов',
      },
      buttons: {
        submit: 'Поиск',
        random: 'Случайный рецепт',
      }
    };
    this.action = ingredientGetPending;
  }

  public ngOnInit(): void {
    this.recipes$ = this.getStore().pipe(select('recipes'), map((state: IRecipesState) => state.loadedRecipes));
    this.selectedIngredients$ = this.getStore().pipe(
      select('ingredients'),
      map((state: IIngredientsState) => state.selected));
    this.foundIngredients$ = this.getStore().pipe(
      select('ingredients'),
      map((state: IIngredientsState) => state.found));
    this.recipe$ = this.getStore().pipe(
      select('recipes'),
      map((state: IRecipesState) => state.recipeToShow)
    );

    const selectedSub = this.selectedIngredients$.subscribe((result: IIngredient[]) => this.selected = result);
    const recipeSub = this.recipe$.pipe(filter((recipe: IRecipe | null) => !!recipe)).subscribe((result) => {
      const modalRef = this.modalService.open(RecipeComponent);
      modalRef.componentInstance.recipe = result;
    });

    this.addSubscriptions(selectedSub, recipeSub);
  }

  public search(): void {
    const payload = this.utils.getRecipeParams(this.selected, null);
    this.getStore().dispatch(recipesGetPending({ payload }));
  }

  public randomSearch() {
    // Eda.ru can't load page without ingredients, it throws 500 error
    if (!this.selected.length) {
      this.notificationService.addErrorMessage('Нет выбранных продуктов!');
      return;
    }
    const payload = this.utils.getRecipeParams(this.selected, null);
    this.getStore().dispatch(recipesGetRandomPending({ payload }));
  }

  public selectIngredient = (item: IIngredient): void => {
    this.getStore().dispatch(ingredientAddPending({ payload: item }));
  }
}
