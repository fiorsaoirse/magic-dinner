import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { fromEvent, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { IStore } from '../../../store/reducers';
import { select, Store } from '@ngrx/store';
import { IRecipesState } from '../../../store/reducers/recipes/recipes.reducer';

@Component({
  selector: 'app-recipe-carousel',
  templateUrl: './recipe-carousel.component.html',
  styleUrls: ['./recipe-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCarouselComponent extends BaseComponent implements OnChanges {
  private readonly minimalSwipePixels: number;
  private recipes$!: Observable<IShortRecipe[]>;
  private recipes!: IShortRecipe[];
  private recipesCount$!: Observable<number>;
  private canShowMore: boolean;

  constructor(store: Store<IStore>, private cd: ChangeDetectorRef) {
    super(store);
    this.minimalSwipePixels = 20;
    this.canShowMore = false;
  }

  @ViewChild('carouselXS', { static: false }) carouselXS!: NgbCarousel;
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.recipes.length) {
      this.setupMobileCarouselEvents();
    }
  }

  init(): void {
    console.log('RecipeCarouselComponent init');
    this.recipes$ = this.getStore().pipe(select('recipes'), map((state: IRecipesState) => state.loadedRecipes));
    this.recipesCount$ = this.getStore().pipe(select('recipes'), map((state: IRecipesState) => state.total));
    const recipesSub = this.recipes$.subscribe((recipes: IShortRecipe[]) => {
      this.recipes = recipes;
      this.cd.detectChanges();
    });
    this.addSubscriptions(recipesSub);
  }

  setupMobileCarouselEvents(): void {
    const { nativeElement: container } = this.carouselContainer;
    const touchStart$: Observable<number> = (fromEvent(container, 'touchstart') as Observable<TouchEvent>)
      .pipe(
        map(({ changedTouches }: TouchEvent) => changedTouches[0].clientX)
      );
    const touchEnd$: Observable<number> = (fromEvent(container, 'touchend') as Observable<TouchEvent>)
      .pipe(
        map(({ changedTouches }: TouchEvent) => changedTouches[0].clientX)
      );
    const swipe$ = zip(touchStart$, touchEnd$)
      .pipe(
        map(([startX, endX]: [number, number]) => startX - endX)
      )
      .subscribe((position: number) => {
      // If the position === 0 means that it was click without swipe
      // And if the position less than 20 pixels let's say that there was no any swipe (cause it was too short)
        if (position === 0 || Math.abs(position) < this.minimalSwipePixels) return;
        if (position > 0) {
          this.carouselXS.next();
        } else {
          this.carouselXS.prev();
        }
      });
    this.addSubscriptions(swipe$);
  }

}
