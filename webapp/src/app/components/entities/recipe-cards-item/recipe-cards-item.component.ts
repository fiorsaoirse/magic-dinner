import { Component, Input } from '@angular/core';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipesService } from '../../../services/entities/recipes/recipes.service';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { Store } from '@ngrx/store';
import { IStore } from '../../../store/reducers';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-cards-item.component.html',
  styleUrls: ['./recipe-cards-item.component.css']
})
export class RecipeCardsItemComponent extends BaseComponent {

  constructor(store: Store<IStore>,
              private modalService: NgbModal,
              private recipesService: RecipesService) {
    super(store);
  }

  @Input()
  card?: IShortRecipe;

  ngOnInit() {
  }

  openRecipe(url: string): void {
    /*this.recipesService.get(url).subscribe((result: IRecipe) => {
      const modalRef = this.modalService.open(RecipeComponent);
      modalRef.componentInstance.recipe = result;
    });*/
  }
}
