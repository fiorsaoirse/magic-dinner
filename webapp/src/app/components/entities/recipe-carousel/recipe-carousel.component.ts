import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { fromEvent, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../base-components/base-component/base-component.component';

@Component({
  selector: 'app-recipe-carousel',
  templateUrl: './recipe-carousel.component.html',
  styleUrls: ['./recipe-carousel.component.css']
})
export class RecipeCarouselComponent extends BaseComponent implements AfterViewInit {

  constructor() {
    super();
  }

  @Input()
    recipes: IShortRecipe[];

  @ViewChild('carouselXS', { static: false }) carouselXS: NgbCarousel;

  // Fields
  mobileCarousel: HTMLDivElement;

  ngAfterViewInit(): void {
    const touchImages = document.documentElement.querySelectorAll('.carousel-touch-item');
    if (touchImages.length) {
      this.setupMobileCarouselEvents(touchImages);
    }
  }

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
    const swipe$ = zip(touchStart$, touchEnd$)
      .pipe(
        map(([startX, endX]: [number, number]) => startX - endX)
      )
      .subscribe((position: number) => {
      // If the position === 0 means that it was click without swipe
      // And if the position less than 20 pixels let's say that there was no any swipe (cause it was too short)
        if (position === 0 || Math.abs(position) < 20) return;
        if (position > 0) {
          this.carouselXS.next();
        } else {
          this.carouselXS.prev();
        }
      });
    this.addSubscription(swipe$);
  }

}
