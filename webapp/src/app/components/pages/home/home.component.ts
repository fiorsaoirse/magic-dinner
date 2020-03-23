import { Component } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { IFoundIngredient } from '../../../interfaces/found-ingredient';
import { RecipesParams } from '../../../classes/recipes-params';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { SearchActions, SearchUIData } from '../../entities/search/search.component';
import { ClearService } from '../../../services/utils/clear.service';
import { IngredientsService } from '../../../services/entities/ingredients/ingredients.service';
import { RecipesService } from '../../../services/entities/recipes/recipes.service';
import { IListRecipes } from '../../../interfaces/responses/list-recipes';
import { IRecipesCount } from '../../../interfaces/responses/recipes-count';
import { Utils } from '../../../utils/utils';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRecipe } from '../../../interfaces/recipe';
import { RecipeComponent } from '../../entities/recipe/recipe.component';

interface State {
  loading: boolean;
  subscriptions: Subscription[];
  currentPage: number;
  constants: {
    [key: string]: number;
  };
}

interface Data {
  selectedIngredients: IFoundIngredient[];
  recipes$: Observable<IShortRecipe[]>;
  recipes: IShortRecipe[];
  totalRecipesCount: number;
}

interface Labels {
  search: SearchUIData;
  buttons: {
    [key: string]: string;
  };
}

interface Actions {
  searchActions: SearchActions;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {

  constructor(private ingredientService: IngredientsService,
              private recipesService: RecipesService,
              private clearService: ClearService,
              private modalService: NgbModal) {
    super();
  }

  private utils = Utils.getUtils();

  // UI data
  private state: State = {
    loading: false,
    subscriptions: null,
    currentPage: null,
    constants: {
      recipesPerPage: 14,
      min: 1,
    }
  };

  // App data
  private data: Data = {
    selectedIngredients: null,
    recipes$: null,
    recipes: null,
    totalRecipesCount: null,
  };

  private labels: Labels = {
    search: {
      question: 'Какие продукты есть в холодильнике?',
      title: '* Название должно содержать не менее 3 символов',
    },
    buttons: {
      submit: 'Поиск',
      random: 'Случайный рецепт',
    }
  };

  private actions: Actions = {
    searchActions: null,
  };

  public ngOnInit(): void {
    // Actions initialization
    this.actions.searchActions = {
      load: this.ingredientService.get.bind(this.ingredientService),
    };
  }

  public addIngredient(ingredient: IFoundIngredient): void {
    this.data.selectedIngredients = this.data.selectedIngredients ?
      [...this.data.selectedIngredients, ingredient] :  [ingredient] ;
    // When user changes the list of selected ingredients, the search should return new recipes from the first page
    if (this.state.currentPage) {
      this.state.currentPage = null;
    }
    this.clearService.clearSearch$$.next(null);
  }

  private getRecipes(page: number | null): Observable<IListRecipes> {
    const includedIngredients = this.data.selectedIngredients.map((curr: IFoundIngredient) => curr.ObjectID);
    const recipesParams = new RecipesParams([],
                                            includedIngredients,
                                            [],
                                            page);
    return this.recipesService.listRecipes(recipesParams);
  }

  private getRecipesCount(): Observable<IRecipesCount> {
    const includedIngredients = this.data.selectedIngredients.map((curr: IFoundIngredient) => curr.ObjectID);
    const recipesParams = new RecipesParams([],
                                            includedIngredients,
                                            [],
                                            null);
    return this.recipesService.recipesCount(recipesParams);
  }

  public search(): void {
    const currentPage = this.state.currentPage ? this.state.currentPage + 1 : this.state.currentPage;
    this.state.loading = true;
    this.data.recipes$ = this.getRecipes(currentPage)
      .pipe(
        // TODO: подгрузка данных???
        map((response: IListRecipes) => response.data),
        tap(() => this.state.loading = false),
      );
  }

  // TODO: add loading
  public randomSearch() {
    // Eda.ru can't load page without ingredients, it throws 500 error
    if (!this.data.selectedIngredients) {
      console.error('No selected');
      return;
    }
    this.state.loading = true;
    this.getRecipesCount()
      .pipe(
        map((result: IRecipesCount) => result.total),
        switchMap((total: string) => {
          const totalNum = parseInt(total, 10);
          const pagesCount = Math.floor(totalNum / this.state.constants.recipesPerPage);
          const randomPage = this.utils.getRandomNumber(this.state.constants.min, pagesCount);
          return this.getRecipes(randomPage);
        }),
        map((recipes: IListRecipes) => recipes.data),
        map((recipes: IShortRecipe[]) => {
          const firstIndex = 0;
          const randomIndex = this.utils.getRandomNumber(firstIndex, this.state.constants.recipesPerPage);
          return recipes[randomIndex];
        }),
        tap(() => this.state.loading = false),
        switchMap((result: IShortRecipe) => this.recipesService.get(result.url).pipe(
            catchError((err)  => {
              console.error(err);
              return of(null);
            }))
        ),
      )
      .subscribe((result: IRecipe | null) => {
        if (!result) return;
        const modalRef = this.modalService.open(RecipeComponent);
        modalRef.componentInstance.recipe = result;
      });
  }

  public deleteFromSelected(id: number): void {
    this.data.selectedIngredients = this.data.selectedIngredients.filter((s: IFoundIngredient) => s.ObjectID !== id);
  }
}
