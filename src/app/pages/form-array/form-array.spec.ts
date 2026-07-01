import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArray } from './form-array';

describe('FormArray', () => {
  let component: FormArray;
  let fixture: ComponentFixture<FormArray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormArray]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormArray);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
