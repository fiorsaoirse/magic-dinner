import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScrollService } from '../../services/utils/scroll.service';

@Directive({
  selector: '[appScrollToTop]'
})
export class ScrollToTopDirective implements OnInit, OnDestroy {

  constructor(private elementRef: ElementRef, private scrollService: ScrollService) { }
  private sub!: Subscription;

  ngOnInit(): void {
    this.sub = this.scrollService.getScrollActions().subscribe((scroll: boolean) => {
      if (!scroll) return;
      const topYPos = (this.elementRef.nativeElement as HTMLElement).offsetTop;
      // TODO: add animation on scrolling
      document.documentElement.scrollTo({
        top: topYPos,
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
