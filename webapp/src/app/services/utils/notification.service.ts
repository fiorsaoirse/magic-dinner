import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { NotificationType } from '../../objects/notification-types.enum';
import { NotificationComponent } from '../../components/dynamic-components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private componentRef!: ComponentRef<NotificationComponent> | null;
  private timeout: number;
  private timerId?: number;

  constructor(private injector: Injector,
              private applicationRef: ApplicationRef,
              private cfResolver: ComponentFactoryResolver) {
    this.timeout = 5000;
  }

  public addSuccessMessage(message: string): void {
    this.addMessage(message, NotificationType.SUCCESS);
  }

  public addWarningMessage(message: string): void {
    this.addMessage(message, NotificationType.WARNING);
  }

  public addErrorMessage(message: string): void {
    this.addMessage(message, NotificationType.DANGER);
  }

  private addMessage(message: string, type: string): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    // Get factory for NotificationComponent
    const factory = this.cfResolver
      .resolveComponentFactory(NotificationComponent);
    // Create new instance of NotificationComponent
    this.componentRef = factory.create(this.injector);
    // Setup component @Input() props
    this.componentRef.instance.message = message;
    this.componentRef.instance.type = type;
    // Get root component ref and node
    const rootComponentRef = this.getRootViewContainer();
    const appComponentRootNode = this.getComponentLocation(rootComponentRef);
    const notificationComponentRootNode = this.getComponentLocation(this.componentRef);
    // Attaching new view for NotificationComponent for app
    this.applicationRef.attachView(this.componentRef.hostView);
    // Add callback on destroying NotificationComponent
    this.componentRef.onDestroy(() => {
      if (this.componentRef === null) {
        throw new Error('ComponentRef is not found!');
      }
      this.applicationRef.detachView(this.componentRef.hostView);
      if (this.timerId) clearTimeout(this.timerId);
      this.componentRef = null;
    });
    // Append NotificationComponent to appRootNode
    appComponentRootNode.appendChild(notificationComponentRootNode);
    // Destroy component in 5 sec
    this.timerId = setTimeout(() => this.componentRef && this.componentRef.destroy(), this.timeout);
  }

  private getRootViewContainer(): ComponentRef<any> {
    const rootComponents = this.applicationRef.components;
    if (rootComponents.length) {
      return rootComponents[0];
    }
    throw new Error('View Container is not found!');
  }

  private getComponentLocation(componentRef: ComponentRef<any>): HTMLElement {
    const { location } = componentRef;
    if (location) {
      return location.nativeElement;
    }
    throw new Error('Location is not found!');
  }
}
