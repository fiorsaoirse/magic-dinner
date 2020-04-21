import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardsComponent } from './recipe-cards.component';

describe('RecipeCardsComponent', () => {
  let component: RecipeCardsComponent;
  let fixture: ComponentFixture<RecipeCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeCardsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
