import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardsItemComponent } from './recipe-cards-item.component';

describe('RecipeCardComponent', () => {
  let component: RecipeCardsItemComponent;
  let fixture: ComponentFixture<RecipeCardsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeCardsItemComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCardsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
