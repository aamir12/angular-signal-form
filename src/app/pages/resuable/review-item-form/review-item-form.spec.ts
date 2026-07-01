import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewItemForm } from './review-item-form';

describe('ReviewItemForm', () => {
  let component: ReviewItemForm;
  let fixture: ComponentFixture<ReviewItemForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewItemForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewItemForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
