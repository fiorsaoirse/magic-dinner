import { Component, Input, OnInit } from '@angular/core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-scroll-to-top-button',
  templateUrl: './scroll-to-top-button.component.html',
  styleUrls: ['./scroll-to-top-button.component.css']
})
export class ScrollToTopButtonComponent implements OnInit {
  private readonly icon = faArrowUp;

  @Input()
  target!: HTMLElement;

  constructor() { }

  ngOnInit(): void {
  }

  public scroll(): void {
    const topYPos = this.target.offsetTop;
    document.documentElement.scrollTo({
      top: topYPos,
    });
  }

}
