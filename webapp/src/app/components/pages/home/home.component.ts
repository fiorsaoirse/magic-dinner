import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { IFoundIngredient } from '../../../interfaces/found-ingredient';
import { RecipesParams } from '../../../classes/recipes-params';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { SearchActions, SearchUIData } from '../../entities/search/search.component';
import { ClearService } from '../../../services/utils/clear.service';
import { IngredientsService } from '../../../services/entities/ingredients/ingredients.service';
import { RecipesService } from '../../../services/entities/recipes/recipes.service';
import { IListRecipes } from '../../../interfaces/responses/list-recipes';
import { IRecipesCount } from '../../../interfaces/responses/recipes-count';
import { getRandomNumber } from '../../../utils/utils';

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
export class HomeComponent implements OnInit {

  constructor(private ingredientService: IngredientsService,
              private recipesService: RecipesService,
              private clearService: ClearService) {
  }

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
          const randomPage = getRandomNumber(this.state.constants.min, pagesCount);
          return this.getRecipes(randomPage);
        }),
        map((recipes: IListRecipes) => recipes.data),
        map((recipes: IShortRecipe[]) => {
          const firstIndex = 0;
          const randomIndex = getRandomNumber(firstIndex, this.state.constants.recipesPerPage);
          return recipes[randomIndex];
        }),
        tap(() => this.state.loading = false),
      )
      .subscribe((result) => {
        console.log('result of getting random page data');
        console.log(result);
      });
  }

  public deleteFromSelected(id: number): void {
    this.data.selectedIngredients = this.data.selectedIngredients.filter((s: IFoundIngredient) => s.ObjectID !== id);
  }


  /*ngOnInit() {
    this.initForm();
    const ingredientSearch$ = this.ingredientsGroup.get('userSearch').valueChanges.pipe(
      debounceTime(500),
      filter((query: string) => !!query),
      map((query: string) => query.trim().toLowerCase()), // TODO: если строка состоит из пробелов, не отправлять ее
      switchMap((query: string) => this.getService.getIngredient(encodeURIComponent(query))),
    );
    this.subs.push(ingredientSearch$.subscribe(({data}) => this.ingredientList = data,
      (err: HttpErrorResponse) => console.error(err)));

    /!* const sizeChange$ = fromEvent(window, 'resize') as Observable<Event>;
    sizeChange$.subscribe(() => {
      if (this.maxCardInRowCount) {
        // If we've already calculated the max count of cards, it's necessary to do again for new window size :)
        const cards = document.querySelectorAll('.card');
        this.setupCardsCount(cards);
      }
    }); *!/
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /!*
    Calculation of the max count of cards, depending on the window's size.
   *!/
  setupCardsCount(cards: NodeListOf<Element>): void {
    const container = cards[0].closest('.cards-container');
    const {width: cardWidth} = getComputedStyle(cards[0]);
    const {width: containerWidth} = getComputedStyle(container);
    this.maxCardInRowCount = Math.floor(parseFloat(containerWidth) / parseFloat(cardWidth));
    console.log(this.maxCardInRowCount);
  }

  /!*
    Add chosen element in the array of elements
   *!/
  setIngredient(ingredient: IFoundIngredient): void {
    this.selectedIngredients.push(ingredient);
    this.ingredientList = [];
    this.ingredientsGroup.get('userSearch').reset();
    // When you change the list of ingredients, search should return new recipes from the first page
    this.currentPage = null;
  }

  /!*
    Delete chosen element from the array of elements.
   *!/
  deleteFromIngredients(ingredientID: number): void {
    this.selectedIngredients = this.selectedIngredients
      .filter((curr: IFoundIngredient) => curr.ObjectID !== ingredientID);
    // When you change the list of ingredients, search should return new recipes from the first page
    this.currentPage = null;
  }

  /!*
    Get the list of elements from the server
   *!/
  getPage(): void {
    const includedIngredients = this.selectedIngredients.map((curr: IFoundIngredient) => curr.ObjectID);
    const recipesParams = new RecipesParams([], includedIngredients, [],
      (this.currentPage ? this.currentPage + 1 : null));
    this.postService.recipes(recipesParams)
      .subscribe(({data, total}) => {
        // When you change the included ingredients array, you expect to get new result set
        // and when you just click the "get more" button, you expect to extend the result set
        this.resultSet = this.currentPage ? [...this.resultSet, ...data] : [...data];
        this.total = total;
        this.currentPage = (this.currentPage ? this.currentPage += 1 : 1);
      });
  }*/
}
