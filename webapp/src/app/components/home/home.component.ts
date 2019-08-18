import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GetService } from '../../services/get.service';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { IFoundIngredient } from '../../interfaces/found-ingredient';
import { HttpErrorResponse } from '@angular/common/http';

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
    const input$ = this.ingredientsGroup.get('ingredientList').valueChanges.pipe(
      debounceTime(500),
      map((query: string) => query.trim().toLowerCase()),
      filter((query: string) => query !== ''),
      switchMap((query: string) => this.getService.findByName(encodeURIComponent(query))),
    );
    this.subs = input$.subscribe(({ data }) => this.ingredientList = data,
                                 (err: HttpErrorResponse) => console.error(err));
  }

  initForm(): void {
    this.ingredientsGroup = new FormGroup({
      ingredientList: new FormControl(null)
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setIngredient(ingredient: IFoundIngredient): void {
    this.selectedIngredients.push(ingredient);
  }
}
