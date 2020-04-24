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
import { INgxLoadingConfig } from 'ngx-loading';
import { NotificationService } from '../../../services/utils/notification.service';

interface State {
  loading: boolean;
  subscriptions: Subscription[];
  currentPage: number | null;
  constants: {
    [key: string]: number;
  };
}

interface Data {
  selectedIngredients: IFoundIngredient[];
  recipes$: Observable<IShortRecipe[]> | null;
  recipes: IShortRecipe[];
  totalRecipesCount: number | null;
}

interface Labels {
  search: SearchUIData;
  buttons: {
    [key: string]: string;
  };
}

interface Actions {
  searchActions: SearchActions | null;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends BaseComponent {
  private utils: Utils;
  private state: State;
  private data: Data;
  private labels: Labels;
  private actions: Actions;
  private spinnerConfig: INgxLoadingConfig;

  constructor(private ingredientService: IngredientsService,
              private recipesService: RecipesService,
              private clearService: ClearService,
              private notificationService: NotificationService,
              private modalService: NgbModal) {
    super();
    this.utils = Utils.getUtils();
    // UI data
    this.state = {
      loading: false,
      subscriptions: [],
      currentPage: null,
      constants: {
        recipesPerPage: 14,
        min: 1,
      }
    };
    // App data
    this.data = {
      selectedIngredients: [],
      recipes$: null,
      recipes: [],
      totalRecipesCount: null,
    };
    // UI Labels
    this.labels = {
      search: {
        question: 'Какие продукты есть в холодильнике?',
        title: '* Название должно содержать не менее 3 символов',
      },
      buttons: {
        submit: 'Поиск',
        random: 'Случайный рецепт',
      }
    };
    // Actions
    this.actions = {
      searchActions: null,
    };
    // Spinner config
    this.spinnerConfig = {
      fullScreenBackdrop: true,
      primaryColour: '#117a8b',
      secondaryColour: '#117a8b',
      tertiaryColour: '#117a8b',
      animationType: 'circleSwish',
    };
  }

  public ngOnInit(): void {
    // Actions initialization
    this.actions.searchActions = {
      load: this.ingredientService.get.bind(this.ingredientService),
    };
  }

  public addIngredient(ingredient: IFoundIngredient): void {
    this.data.selectedIngredients = [...this.data.selectedIngredients, ingredient];
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
    this.state.loading = true;
    // Eda.ru throws an error when page is 0, so init value of current page have to be null
    this.state.currentPage = null;
    // Can't use async pipe in template, cause angular re-renders the whole result list instead of its changed part
    // And with ngIf directive hides previous result
    // (when products$ haven't received Observable yet) than shows it again from the top of block
    const { currentPage } = this.state;
    const searchSubscription = this.getRecipes(currentPage)
      .pipe(
        map((response: IListRecipes) => {
          this.data.totalRecipesCount = response.total;
          return response.data;
        }),
        tap(() => {
          this.state.loading = false;
          this.incrementCurrentPage();
        }),
        catchError((err) => {
          console.error(err);
          this.notificationService.addErrorMessage('Упс, что-то пошло не так! Попробуйте снова!');
          return of([]);
        })
      ).subscribe((result: IShortRecipe[]) => this.data.recipes = result);

    this.addSubscription(searchSubscription);
  }

  public showMore(): void {
    this.state.loading = true;
    this.incrementCurrentPage();
    const { currentPage } = this.state;
    const showMoreSubscription = this.getRecipes(currentPage)
        .pipe(
          map((response: IListRecipes) => response.data),
          catchError((err) => {
            console.error(err);
            return of([]);
          })
        ).subscribe((result: IShortRecipe[]) => this.data.recipes = [...this.data.recipes, ...result]);

    this.addSubscription(showMoreSubscription);
  }

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
        switchMap((result: IShortRecipe) => this.recipesService.get(result.url).pipe(
          catchError((err) => {
            console.error(err);
            return of(null);
          }))
        ),
        tap(() => this.state.loading = false),
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

  private incrementCurrentPage(): void {
    const { currentPage } = this.state;
    this.state.currentPage = currentPage ? currentPage + 1 : 1;
  }
}
