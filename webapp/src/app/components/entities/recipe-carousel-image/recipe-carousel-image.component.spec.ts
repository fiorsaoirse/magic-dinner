import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCarouselImageComponent } from './recipe-carousel-image.component';

describe('RecipeCarouselImageComponent', () => {
  let component: RecipeCarouselImageComponent;
  let fixture: ComponentFixture<RecipeCarouselImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeCarouselImageComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCarouselImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
