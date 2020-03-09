import { Component, Input, OnInit } from '@angular/core';
import { IShortRecipe } from '../../../interfaces/short-recipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecipesService } from '../../../services/entities/recipes/recipes.service';
import { IRecipe } from '../../../interfaces/recipe';
import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-recipe-carousel-image',
  templateUrl: './recipe-carousel-image.component.html',
  styleUrls: ['./recipe-carousel-image.component.css']
})
export class RecipeCarouselImageComponent implements OnInit {

  constructor(private modalService: NgbModal, private recipesService: RecipesService) { }

  @Input()
    image: IShortRecipe;

  ngOnInit() {
    console.log('carousel image init');
  }

  openRecipe (url: string): void {
    this.recipesService.get(url).subscribe((result: IRecipe) => {
      const modalRef = this.modalService.open(RecipeComponent);
      modalRef.componentInstance.recipe = result;
    });
  }

}
