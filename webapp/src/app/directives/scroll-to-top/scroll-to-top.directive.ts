import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { ScrollToTopButtonComponent } from '../../components/dynamic-components/scroll-to-top-button/scroll-to-top-button.component';

@Directive({
  selector: '[appScrollToTop]'
})
export class ScrollToTopDirective implements OnInit, OnDestroy {

  constructor(private elementRef: ElementRef,
              private viewContainerRef: ViewContainerRef,
              private injector: Injector,
              private cfResolver: ComponentFactoryResolver,
              private renderer: Renderer2) {}
  private componentRef!: ComponentRef<ScrollToTopButtonComponent>;
  private componentElement!: HTMLElement;

  ngOnInit(): void {
    this.createButton();
    this.renderer.listen('window', 'scroll', (event: Event) => {
      const { currentTarget } = event;
      const { pageYOffset } = currentTarget as Window;
      const { clientHeight } = document.documentElement;
      // If pageYOffset bigger than a third part of screen
      if ((pageYOffset) >= clientHeight / 3) {
        this.renderer.removeAttribute(this.componentElement, 'hidden');
      } else {
        this.renderer.setAttribute(this.componentElement, 'hidden', 'true');
      }
    });
  }

  private createButton(): void {
    // Destroy button if it exists
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    // Get component factory
    const componentFactory = this.cfResolver.resolveComponentFactory(ScrollToTopButtonComponent);
    // Create component
    this.componentRef = componentFactory.create(this.injector);
    // Setup component @Input() param
    this.componentRef.instance.target = this.elementRef.nativeElement;
    // Insert component after directive element
    this.viewContainerRef.insert(this.componentRef.hostView);
    // Setup HTMLElement for component
    this.componentElement = this.getComponentElement(this.componentRef);
    // By default hide component
    this.renderer.setAttribute(this.componentElement, 'hidden', 'true');
  }

  private getComponentElement(componentRef: ComponentRef<ScrollToTopButtonComponent>): HTMLElement {
    return componentRef.location.nativeElement as HTMLElement;
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }
}
