import { Component } from '@angular/core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { ScrollService } from './services/utils/scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private icon = faArrowUp;

  constructor(private scrollService: ScrollService) {}

  scrollToTop(): void {
    this.scrollService.initScrollActionNext(true);
  }

}
