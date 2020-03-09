import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCarouselComponent } from './recipe-carousel.component';

describe('RecipeCarouselComponent', () => {
  let component: RecipeCarouselComponent;
  let fixture: ComponentFixture<RecipeCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeCarouselComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
