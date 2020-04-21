import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { fromEvent, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../base-components/base-component/base-component.component';

@Component({
  selector: 'app-recipe-carousel',
  templateUrl: './recipe-carousel.component.html',
  styleUrls: ['./recipe-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCarouselComponent extends BaseComponent implements OnChanges {
  private readonly minimalSwipePixels: number;

  constructor() {
    super();
    this.minimalSwipePixels = 20;
  }

  @Input()
    recipes!: IShortRecipe[];

  @Input()
    totalRecipesCount!: number;

  @ViewChild('carouselXS', { static: false }) carouselXS!: NgbCarousel;
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLDivElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.recipes.length) {
      this.setupMobileCarouselEvents();
    }
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
    this.addSubscription(swipe$);
  }

}
