import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GetService } from '../../services/get.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private getService: GetService) {
  }

  ingridientsGroup: FormGroup;
  subs: Subscription;

  ngOnInit() {
    this.initForm();
    const input$ = this.ingridientsGroup.get('ingridientsList').valueChanges.pipe(
      debounceTime(500),
      switchMap((query: string) => this.getService.findByName(query)),

    );
    /*input$.subscribe((currentValue: string) => {
      console.log(currentValue);
    });*/
  }

  initForm(): void {
    this.ingridientsGroup = new FormGroup({
      'ingridientsList': new FormControl(null)
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
