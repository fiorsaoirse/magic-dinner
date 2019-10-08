import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fromEvent, Observable, Subscription, zip } from 'rxjs';
import { GetService } from '../../services/actions/get.service';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { IFoundIngredient } from '../../interfaces/found-ingredient';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipesParams } from '../../classes/recipes-params';
import { PostService } from '../../services/actions/post.service';
import { IShortRecipe } from '../../interfaces/short-recipe';
import { IRecipe } from '../../interfaces/recipe';
import { NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewChecked {

  constructor(private getService: GetService, private postService: PostService,
              private modalService: NgbModal) {
  }

  @ViewChild('carouselXS', { static: false }) carouselXS: NgbCarousel;

  // Init
  ingredientsGroup: FormGroup;
  subs: Subscription[] = [];

  // Data
  ingredientList: IFoundIngredient[];
  selectedIngredients: IFoundIngredient[] = [];
  resultSet: IShortRecipe[] = [];
  maxCardInRowCount: number;
  currentPage: (number | null) = null;
  total: number;

  // Fields
  mobileCarousel: HTMLDivElement;

  // Constants
  cardWidth = 18;
  cardRows = 2;

  ngOnInit() {
    this.initForm();
    const ingredientSearch$ = this.ingredientsGroup.get('userSearch').valueChanges.pipe(
      debounceTime(500),
      filter((query: string) => !!query),
      map((query: string) => query.trim().toLowerCase()), // TODO: если строка состоит из пробелов, не отправлять ее
      switchMap((query: string) => this.getService.getIngredient(encodeURIComponent(query))),
    );
    this.subs.push(ingredientSearch$.subscribe(({ data }) => this.ingredientList = data,
                                               (err: HttpErrorResponse) => console.error(err)));

    const sizeChange$ = fromEvent(window, 'resize') as Observable<Event>;
    sizeChange$.subscribe(() => {
      if (this.maxCardInRowCount) {
        // If we've already calculated the max count of cards, it's necessary to do again for new window size :)
        const cards = document.querySelectorAll('.card');
        this.setupCardsCount(cards);
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewChecked(): void {
    // TODO: выполняется в любом случае... Придумать, как ограничить только версией экрана
    if (this.mobileCarousel || this.maxCardInRowCount) return;
    const doc = document.documentElement;
    const touchImages = doc.querySelectorAll('.carousel-touch-item');
    const cards = doc.querySelectorAll('.card');
    if (touchImages.length) {
      this.setupMobileCarouselEvents(touchImages);
    }
    if (cards.length) {
      this.setupCardsCount(cards);
    }
  }

  /*
    Form initialization.
   */
  initForm(): void {
    this.ingredientsGroup = new FormGroup({
      userSearch: new FormControl('')
    });
  }

  /*
    Setup subscription on swipe events to change slides.
  */
  setupMobileCarouselEvents(images: NodeListOf<Element>): void {
    this.mobileCarousel = images[0].closest('.carousel-inner') as HTMLDivElement;
    const touchStart$: Observable<number> = (fromEvent(this.mobileCarousel, 'touchstart') as Observable<TouchEvent>)
      .pipe(
        map(({ changedTouches }: TouchEvent) => changedTouches[0].clientX)
      );
    const touchEnd$: Observable<number> = (fromEvent(this.mobileCarousel, 'touchend') as Observable<TouchEvent>)
      .pipe(
        map(({ changedTouches }: TouchEvent) => changedTouches[0].clientX)
      );
    const swipe$: Observable<number> = zip(touchStart$, touchEnd$)
      .pipe(
        map(([startX, endX]: [number, number]) => startX - endX)
      );
    this.subs.push(swipe$.subscribe((position: number) => {
      // If the position === 0 means that it was click without swipe
      // And if the position less than 20 pixels let's say that there was no any swipe (cause it was too short)
      if (position === 0 || Math.abs(position) < 20) return;
      const direction = position > 0 ? 'left' : 'right';
      if (direction === 'left') {
        this.carouselXS.next();
      } else {
        this.carouselXS.prev();
      }
    }));
  }

  /*
    Calculation of the max count of cards, depending on the window's size.
   */
  setupCardsCount(cards: NodeListOf<Element>): void {
    const container = cards[0].closest('.cards-container');
    const { width: cardWidth } = getComputedStyle(cards[0]);
    const { width: containerWidth } = getComputedStyle(container);
    this.maxCardInRowCount = Math.floor(parseFloat(containerWidth) / parseFloat(cardWidth));
    console.log(this.maxCardInRowCount);
  }

  /*
    Add chosen element in the array of elements
   */
  setIngredient(ingredient: IFoundIngredient): void {
    this.selectedIngredients.push(ingredient);
    this.ingredientList = [];
    this.ingredientsGroup.get('userSearch').reset();
    // When you change the list of ingredients, search should return new recipes from the first page
    this.currentPage = null;
  }

  /*
    Delete chosen element from the array of elements.
   */
  deleteFromIngredients(ingredientID: number): void {
    this.selectedIngredients = this.selectedIngredients
      .filter((curr: IFoundIngredient) => curr.ObjectID !== ingredientID);
    // When you change the list of ingredients, search should return new recipes from the first page
    this.currentPage = null;
  }

  /*
    Get the list of elements from the server
   */
  getPage(): void {
    const includedIngredients = this.selectedIngredients.map((curr: IFoundIngredient) => curr.ObjectID);
    const recipesParams = new RecipesParams([], includedIngredients, [],
                                            (this.currentPage ? this.currentPage + 1 : null));
    this.postService.recipes(recipesParams)
      .subscribe(({ data, total }) => {
        // When you change the included ingredients array, you expect to get new result set
        // and when you just click the "get more" button, you expect to extend the result set
        this.resultSet = this.currentPage ? [...this.resultSet, ...data] : [...data];
        this.total = total;
        this.currentPage = (this.currentPage ? this.currentPage += 1 : 1);
      });
  }

  /*
    Show chosen recipe in modal.
   */
  openRecipe(url: string): void {
    this.getService.getRecipe(url).subscribe((result: IRecipe) => {
      const modalRef = this.modalService.open(RecipeComponent);
      modalRef.componentInstance.recipe = result;
    });
  }

  /*
  Getting pages count.
  */
  getPagesCount(): void {

  }
}
