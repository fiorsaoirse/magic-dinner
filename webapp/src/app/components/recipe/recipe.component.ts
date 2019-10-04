import { Component, Input } from '@angular/core';
import { IRecipe } from '../../interfaces/recipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent {

  @Input()
  recipe: IRecipe;

  constructor(public activeModal: NgbActiveModal) {}

}
