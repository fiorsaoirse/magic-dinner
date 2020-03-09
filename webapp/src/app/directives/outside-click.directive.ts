import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, } from '@angular/core';

@Directive({
  selector: '[appOutsideClick]'
})
export class OutsideClickDirective implements OnInit, OnDestroy {

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  private eventHandler = this.onClick.bind(this);

  @Output()
  outsideClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  ngOnDestroy(): void {
    this.removeClickListener();
  }

  ngOnInit(): void {
    this.addClickListener();
  }

  private emit(e: MouseEvent): void {
    this.ngZone.run(() => this.outsideClick.emit(e));
  }

  private onClick(event: MouseEvent): void {
    const { target } = event;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.emit(event);
    }
  }

  private addClickListener(): void {
    this.ngZone.runOutsideAngular(() => document.addEventListener('click', this.eventHandler));
  }

  private removeClickListener(): void {
    this.ngZone.runOutsideAngular(() => document.removeEventListener('click', this.eventHandler));
  }
}
