import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GetService } from '../../services/get.service';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { IFoundIngredient } from '../../interfaces/found-ingredient';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipesParams } from '../../classes/recipes-params';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private getService: GetService) {
  }

  // Init
  ingredientsGroup: FormGroup;
  subs: Subscription;
  // Data
  ingredientList: IFoundIngredient[];
  selectedIngredients: IFoundIngredient[] = [];

  ngOnInit() {
    this.initForm();
    const input$ = this.ingredientsGroup.get('userSearch').valueChanges.pipe(
      debounceTime(500),
      filter((query: string) => !!query),
      map((query: string) => query.trim().toLowerCase()), // TODO: если строка состоит из пробелов, не отправлять ее
      switchMap((query: string) => this.getService.findByName(encodeURIComponent(query))),
    );
    this.subs = input$.subscribe(({ data }) => this.ingredientList = data,
                                 (err: HttpErrorResponse) => console.error(err));
  }

  initForm(): void {
    this.ingredientsGroup = new FormGroup({
      userSearch: new FormControl('')
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setIngredient(ingredient: IFoundIngredient): void {
    this.selectedIngredients.push(ingredient);
    this.ingredientList = [];
    this.ingredientsGroup.get('userSearch').reset();
  }

  deleteFromIngredients(ingredientID: number): void {
    this.selectedIngredients = this.selectedIngredients.filter((curr: IFoundIngredient) => curr.ObjectID !== ingredientID);
  }

  getPage(): void {
    const includedIngredients = this.selectedIngredients.map((curr: IFoundIngredient) => curr.ObjectID);
    const recipesParams = new RecipesParams('', [], includedIngredients, []);
    this.getService.getRecipes(recipesParams).subscribe(( { data }) => console.log(data));
  }
}
