import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output, } from '@angular/core';

/* Directive that emits an event when
 * catches user's click outside bind element
*/

@Directive({
  selector: '[appOutsideClick]'
})
export class OutsideClickDirective implements OnInit {

  constructor(private elementRef: ElementRef) {}

  @Output()
  outsideClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event'])
  public click(event: MouseEvent): void {
    const { target } = event;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.outsideClick.emit(event);
    }
  }

  ngOnInit(): void {
  }
}
