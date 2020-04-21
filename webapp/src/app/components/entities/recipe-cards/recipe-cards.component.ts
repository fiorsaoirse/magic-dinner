import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { IShortRecipe } from '../../../interfaces/short-recipe';

@Component({
  selector: 'app-recipe-cards',
  templateUrl: './recipe-cards.component.html',
  styleUrls: ['./recipe-cards.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCardsComponent extends BaseComponent {

  constructor() {
    super();
  }

  @Input()
    recipes!: IShortRecipe[];

  @Input()
    totalRecipesCount!: number;

  @Output()
    showMore: EventEmitter<void> = new EventEmitter<void>();

  public trackByFn(index: number, item: IShortRecipe): string {
    return `${index}-${item.title}`;
  }

  public emitShowMore(): void {
    this.showMore.emit();
  }
}
