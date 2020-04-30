import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base-components/base-component/base-component.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, skipWhile } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { IStore } from '../../../store/reducers';
import { SearchActionType } from '../../../store/actions/utils';
import { Observable } from 'rxjs';
import { ClearService } from '../../../services/utils/clear.service';

export interface SearchUILabels {
  question: string;
  hint?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent extends BaseComponent {
  private form!: FormGroup;

  constructor(store: Store<IStore>, private formBuilder: FormBuilder, private clearService: ClearService) {
    super(store);
    const sub = this.clearService.getClear().subscribe(() => this.searchInput.reset());
    this.addSubscriptions(sub);
  }

  @Input()
  action!: SearchActionType;
  @Input()
  uiLabels!: SearchUILabels;
  @Input()
  foundElements$!: Observable<any[]>;
  @Input()
  template?: TemplateRef<any>;

  init() {
    if (!this.action) {
      throw new Error(`Search component must contain load action!`);
    }
    this.form = this.formBuilder.group({
      searchInput: this.formBuilder.control(null)
    });

    const searchInputSub = this.searchInput.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // When input search is reset, the initial state is null
      filter(value => !!value),
      map((value: string) => value.trim().toLowerCase()),
      skipWhile((value: string) => value.length < 3),
    ).subscribe((value: string) => this.getStore().dispatch(this.action(encodeURIComponent(value))));

    this.addSubscriptions(searchInputSub);
  }

  // tslint:disable-next-line:variable-name
  hide(_event: Event): void {
    // TODO: hide result list
    console.log('close event');
  }

  get searchInput(): FormControl {
    const searchInput = this.form.get('searchInput');
    if (!searchInput) throw new Error(`The form doesn't have "searchInput" control`);
    return searchInput as FormControl;
  }
}
