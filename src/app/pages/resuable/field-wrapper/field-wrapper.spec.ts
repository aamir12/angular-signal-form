import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWrapper } from './field-wrapper';

describe('FieldWrapper', () => {
  let component: FieldWrapper;
  let fixture: ComponentFixture<FieldWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
