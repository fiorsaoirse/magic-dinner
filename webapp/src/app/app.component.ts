import { Component } from '@angular/core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ScrollService } from './services/utils/scroll.service';
import { INgxLoadingConfig } from 'ngx-loading';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IStore } from './store/reducers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private icon = faArrowUp;
  private spinnerConfig: INgxLoadingConfig;
  private loading$!: Observable<boolean>;

  constructor(private store: Store<IStore>, private scrollService: ScrollService) {
    // Spinner config
    this.spinnerConfig = {
      fullScreenBackdrop: true,
      primaryColour: '#117a8b',
      secondaryColour: '#117a8b',
      tertiaryColour: '#117a8b',
      animationType: 'circleSwish',
    };
    this.loading$ = this.store.pipe(select('common'), map(state => state.loading.count !== 0));
  }

  scrollToTop(): void {
    this.scrollService.initScrollActionNext(true);
  }

}
