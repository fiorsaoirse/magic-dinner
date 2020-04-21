import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { concat, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, skipWhile, switchMap, tap } from 'rxjs/operators';
import { ClearService } from '../../../services/utils/clear.service';

interface Data {
  result$: Observable<any> | null;
  result: any[] | null;
}

interface State {
  form?: FormGroup;
  loading: boolean;
}

export interface SearchActions {
  load: (...rest: any[]) => Observable<any>;
}

export interface SearchUIData {
  question: string;
  title?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent extends BaseComponent {
  private data: Data;
  private state: State;

  constructor(private clearService: ClearService) {
    super();
    // UI state
    this.state = {
      loading: false,
    };
    // App data
    this.data = {
      result$: null,
      result: null,
    };
  }

  // UI data
  @Input()
  label?: SearchUIData;
  @Input()
  actions?: SearchActions;
  @Input()
  selectedItems?: any[];
  @Input()
  template?: TemplateRef<any>;
  @Output()
  deleteFromSelected: EventEmitter<number> = new EventEmitter<number>();

  init() {
    this.state.form = new FormGroup({
      input: new FormControl(null),
    });
    if (!this.actions) {
      throw new Error(`The action for input field valueChanges is undefined`);
    }
    this.data.result$ = this.input.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((value: string) => value.trim().toLowerCase()),
        skipWhile((value: string) => value.length < 3),
        map((value: string) => encodeURIComponent(value)),
        tap(() => this.state.loading = true),
        switchMap((value: string) => {
          if (!this.actions) return of({ data: [] });
          return this.actions.load(value)
              .pipe(
                catchError((err) => {
                  console.error(`Error in evaluating action: ${err}.`);
                  return of({ data: [] });
                })
              );
        }
        ),
        tap(() => this.state.loading = false),
      );

    const clearInputSub = this.clearService.clearSearch$$.subscribe((nextValue: any) => {
      if (nextValue === null) {
        this.input && this.input.reset();
        this.data.result$ = concat([
          of([]),
          this.data.result$
        ]);
      }
    });

    this.addSubscription(clearInputSub);
  }

  // tslint:disable-next-line:variable-name
  hide(_event: Event): void {
    // TODO: hide result list
    console.log('close event');
  }

  delete(id: number): void {
    console.log(id);
    // TODO: modX or something (redux) for APP state
    this.deleteFromSelected.emit(id);
  }

  get input(): AbstractControl {
    const control = this.state.form && this.state.form.get('input');
    if (!control) {
      throw new Error(`The form doesn't have control "input"`);
    }
    return control;
  }
}
