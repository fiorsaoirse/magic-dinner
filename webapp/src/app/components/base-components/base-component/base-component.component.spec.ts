import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFormComponentComponent } from './base-component.component';

describe('BaseFormComponentComponent', () => {
  let component: BaseFormComponentComponent;
  let fixture: ComponentFixture<BaseFormComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseFormComponentComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
